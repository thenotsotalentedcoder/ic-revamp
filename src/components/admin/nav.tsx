"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api, btn } from "./kit";

const GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard" }] },
  {
    label: "Content",
    items: [
      { href: "/admin/speakers", label: "Speakers" },
      { href: "/admin/workshops", label: "Workshops" },
      { href: "/admin/dates", label: "Important dates" },
      { href: "/admin/tracks", label: "Tracks" },
      { href: "/admin/committee", label: "Committee" },
      { href: "/admin/reviewers", label: "Reviewers" },
      { href: "/admin/previous-conferences", label: "Previous conferences" },
      { href: "/admin/call-for-papers", label: "Call for papers" },
    ],
  },
];

export function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const signOut = async (all: boolean) => {
    if (all && !window.confirm("Sign out of every device?")) return;
    setBusy(true);
    try {
      await api(all ? "/api/admin/logout-all" : "/api/admin/logout", { method: "POST" });
    } finally {
      // Full reload on purpose: drops all client state tied to the old session.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/login";
    }
  };

  const links = (
    <nav aria-label="Admin" className="space-y-6">
      {GROUPS.map((g) => (
        <div key={g.label}>
          <p className="px-3 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/50">{g.label}</p>
          <ul>
            {g.items.map((i) => {
              const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-[2px] px-3 py-2 text-[15px] transition-colors ${active ? "bg-white/12 font-semibold text-white" : "text-white/75 hover:bg-white/8 hover:text-white"}`}
                  >
                    {i.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const account = (
    <div className="border-t border-white/15 pt-4">
      <p className="truncate px-3 text-[14px] font-semibold text-white">{name}</p>
      <p className="truncate px-3 text-[13px] text-white/60">{email}</p>
      <div className="mt-3 flex flex-col gap-1.5 px-1">
        <Link href="/" target="_blank" className="rounded-[2px] px-2 py-1.5 text-[14px] text-white/75 hover:bg-white/8 hover:text-white">
          View public site ↗
        </Link>
        <button type="button" disabled={busy} onClick={() => signOut(false)} className="rounded-[2px] px-2 py-1.5 text-left text-[14px] text-white/75 hover:bg-white/8 hover:text-white">
          Sign out
        </button>
        <button type="button" disabled={busy} onClick={() => signOut(true)} className="rounded-[2px] px-2 py-1.5 text-left text-[14px] text-white/75 hover:bg-white/8 hover:text-white">
          Sign out everywhere
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-950 px-4 py-3 text-white lg:hidden">
        <span className="font-display text-[20px] font-semibold">
          iCONICS<span className="text-teal-300">’26</span> <span className="text-[14px] font-normal text-white/70">admin</span>
        </span>
        <button type="button" className={`${btn.secondary} h-9 !border-white/30 !bg-transparent !text-white`} aria-expanded={open} aria-controls="admin-menu" onClick={() => setOpen(!open)}>
          Menu
        </button>
      </header>
      <aside id="admin-menu" className={`on-dark bg-navy-950 p-4 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto lg:p-5 ${open ? "block" : "hidden"}`}>
        <p className="mb-8 hidden px-3 font-display text-[24px] font-semibold leading-none text-white lg:block">
          iCONICS<span className="text-teal-300">’26</span>
          <span className="mt-1 block font-body text-[13px] font-normal text-white/60">Admin panel</span>
        </p>
        <div className="flex min-h-0 flex-col gap-8 lg:min-h-[calc(100dvh-110px)] lg:justify-between">
          {links}
          {account}
        </div>
      </aside>
    </>
  );
}
