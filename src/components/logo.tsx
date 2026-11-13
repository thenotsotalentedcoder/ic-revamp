import Image from "next/image";

/**
 * Optically balanced logo: every mark gets roughly the same visual area,
 * so a square crest and a long wordmark look equally weighted in a row.
 */
export function BalancedLogo({
  src,
  alt,
  w,
  h,
  area = 4200,
  maxW = 170,
  maxH = 64,
  className = "",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  area?: number;
  maxW?: number;
  maxH?: number;
  className?: string;
}) {
  const aspect = w / h;
  let height = Math.sqrt(area / aspect);
  let width = height * aspect;
  if (width > maxW) {
    width = maxW;
    height = width / aspect;
  }
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={Math.round(width)}
      height={Math.round(height)}
      unoptimized={src.endsWith(".svg")}
      className={`object-contain ${className}`}
      style={{ width: Math.round(width), height: Math.round(height) }}
    />
  );
}
