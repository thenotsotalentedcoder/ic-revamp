/**
 * Create an admin account, or reset an admin's password (also signs them out everywhere).
 *
 *   node --env-file=.env.local scripts/create-admin.mjs <email> "<name>"
 *   node --env-file=.env.local scripts/create-admin.mjs --disable <email>
 *
 * Password comes from ADMIN_PASSWORD or a hidden prompt; minimum 12 characters.
 */
import { createInterface } from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function promptHidden(q) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s); };
    rl.question(q, (a) => { rl.close(); process.stdout.write("\n"); resolve(a); });
  });
}

try {
  const args = process.argv.slice(2);
  if (args[0] === "--disable") {
    const email = (args[1] ?? "").trim().toLowerCase();
    await db.admin.update({ where: { email }, data: { isActive: false, tokenVersion: { increment: 1 } } });
    console.log(`Disabled ${email} and revoked its sessions.`);
  } else {
    const [rawEmail, name] = args;
    const email = (rawEmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
      console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs <email> "<name>"');
      process.exit(1);
    }
    let password = process.env.ADMIN_PASSWORD;
    if (!password) {
      password = await promptHidden("Password (min 12 chars): ");
      if (password !== (await promptHidden("Confirm password: "))) { console.error("Passwords do not match."); process.exit(1); }
    }
    if (password.length < 12) { console.error("Password must be at least 12 characters."); process.exit(1); }
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await db.admin.upsert({
      where: { email },
      update: { name, passwordHash, isActive: true, tokenVersion: { increment: 1 } },
      create: { email, name, passwordHash },
    });
    console.log(`Admin ready: ${admin.email}`);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
} finally {
  await db.$disconnect();
}
