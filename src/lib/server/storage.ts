import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { requireEnv } from "./env";

let client: SupabaseClient | null = null;
function supabase() {
  // Service-role key: server only. Never expose it via NEXT_PUBLIC_*.
  return (client ??= createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_KEY"), { auth: { persistSession: false } }));
}

/** Speaker / reviewer / workshop images and CFP files shown on the public site. */
const PUBLIC_BUCKET = () => process.env.SUPABASE_PUBLIC_BUCKET || "public-assets";

export class UploadError extends Error {}

export type FileKind = "image" | "document" | "zip";
const RULES: Record<FileKind, { exts: string[]; max: number }> = {
  image: { exts: [".png", ".jpg", ".jpeg", ".webp"], max: 5 * 1024 * 1024 },
  document: { exts: [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"], max: 10 * 1024 * 1024 },
  zip: { exts: [".zip"], max: 50 * 1024 * 1024 },
};

// File signatures: extension and client MIME type are attacker-controlled, so content is checked too.
const SIGNATURES: Record<string, number[][]> = {
  ".pdf": [[0x25, 0x50, 0x44, 0x46]],
  ".png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  ".jpg": [[0xff, 0xd8, 0xff]],
  ".jpeg": [[0xff, 0xd8, 0xff]],
  ".doc": [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],
  ".docx": [[0x50, 0x4b, 0x03, 0x04]],
  ".zip": [[0x50, 0x4b, 0x03, 0x04]],
  ".webp": [[0x52, 0x49, 0x46, 0x46]],
};

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".zip": "application/zip",
};

const extOf = (name: string) => {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i).toLowerCase().replace(/[^a-z0-9.]/g, "");
};

/** Validates size, extension and magic bytes. Returns the bytes and normalised extension. */
export async function checkFile(file: File, kind: FileKind, label = "File") {
  const rule = RULES[kind];
  const ext = extOf(file.name);
  if (!rule.exts.includes(ext)) throw new UploadError(`${label}: only ${rule.exts.map((e) => e.slice(1).toUpperCase()).join(", ")} files are allowed.`);
  if (file.size > rule.max) throw new UploadError(`${label} must be ${Math.round(rule.max / 1024 / 1024)} MB or smaller.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const sigs = SIGNATURES[ext] ?? [];
  const ok = sigs.some((s) => s.every((b, i) => bytes[i] === b)) && (ext !== ".webp" || new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP");
  if (!ok) throw new UploadError(`${label} does not look like a valid ${ext.slice(1).toUpperCase()} file.`);
  return { bytes, ext };
}

async function put(bucket: string, folder: string, file: File, kind: FileKind, label?: string) {
  const { bytes, ext } = await checkFile(file, kind, label);
  // Random object names: unguessable, and no registrant PII in the path.
  const path = `${folder}/${randomUUID()}${ext}`;
  const { data, error } = await supabase().storage.from(bucket).upload(path, bytes, { contentType: TYPES[ext] ?? "application/octet-stream", upsert: false });
  if (error) throw new Error(`File upload failed: ${error.message}`);
  return data.path;
}

/** Upload to the public bucket; returns the public URL. */
export async function uploadPublic(file: File, folder: string, kind: FileKind = "image", label?: string) {
  const path = await put(PUBLIC_BUCKET(), folder, file, kind, label);
  return supabase().storage.from(PUBLIC_BUCKET()).getPublicUrl(path).data.publicUrl;
}

/** Best-effort removal of a replaced/deleted public file (ignored if it isn't one of ours). */
export async function removePublicByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${PUBLIC_BUCKET()}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  try {
    await supabase().storage.from(PUBLIC_BUCKET()).remove([decodeURIComponent(url.slice(i + marker.length).split("?")[0])]);
  } catch {
    /* an orphaned file is harmless */
  }
}
