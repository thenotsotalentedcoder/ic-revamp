"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONFERENCE, NAV, type NavGroup } from "@/lib/site";

export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 leading-none"
      aria-label={`${CONFERENCE.short}, home`}
    >
      <span
        className={`font-display text-[24px] font-semibold tracking-[-0.01em] ${onDark ? "text-white" : "text-navy-950"}`}
      >
        {CONFERENCE.brand}
        <span className={onDark ? "text-teal-300" : "text-teal-700"}>’26</span>
      </span>
      <span
        className={`hidden border-l pl-3 text-[12px] leading-[1.3] xl:block ${onDark ? "border-white/25 text-white/70" : "border-line text-ink-600"}`}
      >
        5th International Conference on
        <br />
        Innovations in Computer Science
      </span>
    </Link>
  );
}

function isActive(pathname: string, group: NavGroup) {
  const hrefs = [group.href, ...(group.items?.map((i) => i.href) ?? [])];
  return hrefs.some((h) =>
    h === "/"
      ? pathname === "/"
      : pathname === h || pathname.startsWith(h + "/"),
  );
}

function DesktopGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active = isActive(pathname, group);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkCls = `relative inline-flex h-16 items-center text-[15px] font-medium transition-colors duration-150 hover:text-teal-700 ${
    active
      ? "text-navy-950 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-teal-700"
      : "text-navy-950/80"
  }`;

  if (!group.items)
    return (
      <li>
        <Link
          href={group.href}
          className={linkCls}
          aria-current={pathname === group.href ? "page" : undefined}
        >
          {group.label}
        </Link>
      </li>
    );

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${linkCls} gap-1.5`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {group.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5 5 6.5 8 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={`absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-0 transition-[opacity,transform] duration-150 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="border border-line border-t-2 border-t-teal-700 bg-white py-2 shadow-[0_1px_2px_rgba(11,27,51,0.06),0_12px_32px_rgba(11,27,51,0.12)]">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block px-5 py-3 transition-colors duration-150 hover:bg-surface-50 aria-[current=page]:bg-surface-50"
              >
                <span className="block text-[15px] font-semibold text-navy-950">
                  {item.label}
                </span>
                {item.description && (
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink-600">
                    {item.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 md:px-8">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((g) => (
              <DesktopGroup key={g.label} group={g} pathname={pathname} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/registration"
            className="hidden h-10 items-center rounded-[2px] bg-teal-700 px-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-teal-800 sm:inline-flex"
          >
            Register
          </Link>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[2px] border border-navy-950/20 px-3 text-[15px] font-medium lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((m) => !m)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {menu ? (
                <path
                  d="M3 3l10 10M13 3 3 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 4.5h12M2 8h12M2 11.5h12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
            Menu
          </button>
        </div>
      </div>

      <div className="collapse-panel lg:hidden" data-open={menu} inert={!menu}>
        <div>
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-white"
          >
            <ul className="mx-auto max-w-[1200px] px-4 py-3 md:px-8">
              {NAV.map((g) => (
                <li
                  key={g.label}
                  className="border-b border-line last:border-0"
                >
                  {g.items ? (
                    <>
                      <p className="pb-1 pt-4 text-[13px] font-semibold text-ink-600">
                        {g.label}
                      </p>
                      <ul className="pb-3">
                        {g.items.map((i) => (
                          <li key={i.href}>
                            <Link
                              href={i.href}
                              className="block py-2 text-[17px] font-medium"
                            >
                              {i.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={g.href}
                      className="block py-4 text-[17px] font-medium"
                    >
                      {g.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mx-auto max-w-[1200px] px-4 pb-5 md:px-8">
              <Link
                href="/registration"
                className="flex h-12 items-center justify-center rounded-[2px] bg-teal-700 text-[16px] font-semibold text-white"
              >
                Register for {CONFERENCE.short}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
