"use client";

import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/** Public site chrome (header, footer, page transition). The admin area brings its own layout, so it skips this. */
export function Chrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main" className="flex-1">
        {/* Route changes crossfade only the page content; header and footer stay still. */}
        <ViewTransition default="page">{children}</ViewTransition>
      </main>
      {footer}
    </>
  );
}
