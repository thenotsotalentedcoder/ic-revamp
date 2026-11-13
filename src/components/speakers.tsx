"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Person } from "@/lib/people";
import { roleLabel } from "@/lib/people";
import { BalancedLogo } from "./logo";
import { Flag } from "./ui";

/* ── Dialog ──────────────────────────────────────────────────────────── */

export function SpeakerDialog({ person, onClose }: { person: Person | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  // Keep the last person rendered while the dialog animates closed.
  const [shown, setShown] = useState<Person | null>(person);
  if (person && person !== shown) setShown(person);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (person && !d.open) d.showModal();
    if (!person && d.open) d.close();
  }, [person]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="speaker-dialog-name"
      className="modal m-auto max-h-[calc(100dvh-32px)] w-[min(820px,calc(100vw-24px))] rounded-[2px] bg-white p-0 text-navy-950 shadow-[0_2px_4px_rgba(11,27,51,0.08),0_32px_80px_rgba(11,27,51,0.28)]"
    >
      {shown && (
        <article className="relative">
          <div className="grid sm:grid-cols-[260px_1fr]">
            <div className="relative aspect-[4/5] bg-surface-100 sm:aspect-auto sm:min-h-full">
              {shown.photo && <Image src={shown.photo} alt="" fill sizes="260px" className="object-cover" />}
            </div>
            <div className="p-6 sm:p-9">
              <p className="text-[14px] font-semibold text-teal-700">{roleLabel(shown)} speaker</p>
              <h2 id="speaker-dialog-name" className="mt-2 text-[30px] leading-[1.1]">
                {shown.name}
              </h2>
              <p className="mt-3 text-[16px] leading-snug text-ink-600">
                {shown.title}
                <br />
                {shown.institution}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-[15px]">
                <Flag code={shown.country.code} />
                {shown.country.name}
              </p>
              {shown.logo && (
                <div className="mt-5 border-t border-line pt-5">
                  <BalancedLogo src={shown.logo.src} alt={shown.institution} w={shown.logo.w} h={shown.logo.h} area={3600} maxW={180} maxH={56} />
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-line p-6 sm:p-9">
            {shown.bio.length > 40 ? (
              <div className="max-w-[640px] space-y-4 whitespace-pre-line text-[16px] leading-[1.7]">{shown.bio}</div>
            ) : (
              <p className="text-ink-600">A full biography will be published shortly.</p>
            )}
            {shown.workshops.length > 0 && (
              <p className="mt-6 text-[15px]">
                <span className="font-semibold">Workshop: </span>
                {shown.workshops.join(", ")}
              </p>
            )}
            {shown.topics.length > 0 && (
              <p className="mt-3 text-[15px] text-ink-600">
                <span className="font-semibold text-navy-950">Research areas: </span>
                {shown.topics.join(", ")}
              </p>
            )}
            {shown.links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                {shown.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 underline decoration-teal-700/35 underline-offset-[5px] hover:decoration-teal-700">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-[2px] bg-white/90 text-navy-950 hover:bg-surface-100"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </article>
      )}
    </dialog>
  );
}

/* ── Cards ───────────────────────────────────────────────────────────── */

function Meta({ person }: { person: Person }) {
  return (
    <span className="mt-3 flex items-center gap-2 text-[14px] text-ink-600">
      <Flag code={person.country.code} />
      {person.country.name}
    </span>
  );
}

/** Keynote: wide card, photo + text side by side, institution mark, bio excerpt. */
function KeynoteCard({ person, onOpen, priority = false }: { person: Person; onOpen: () => void; priority?: boolean }) {
  return (
    <button type="button" onClick={onOpen} aria-haspopup="dialog" className="group grid w-full grid-cols-1 items-stretch sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] bg-white text-left shadow-[0_0_0_1px_rgba(11,27,51,0.08)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(11,27,51,0.25),0_12px_32px_rgba(11,27,51,0.10)]">
      <span className="relative block aspect-[4/5] overflow-hidden bg-surface-100">
        {person.photo && (
          <Image src={person.photo} alt="" fill priority={priority} sizes="(min-width:1024px) 240px, 40vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        )}
      </span>
      <span className="flex flex-col p-5 md:p-6">
        <span className="text-[13px] font-semibold text-teal-700">{roleLabel(person)}</span>
        <span className="mt-2 font-display text-[22px] font-semibold leading-[1.15] md:text-[24px]">{person.name}</span>
        <span className="mt-2 text-[15px] leading-snug text-ink-600">
          {person.title}, {person.institution}
        </span>
        <Meta person={person} />
        <span className="mt-auto flex items-end justify-between gap-3 pt-5">
          {person.logo ? (
            <BalancedLogo src={person.logo.src} alt="" w={person.logo.w} h={person.logo.h} area={2200} maxW={130} maxH={44} />
          ) : (
            <span />
          )}
          <span className="text-[14px] font-semibold text-teal-700 underline decoration-teal-700/35 underline-offset-[5px] group-hover:decoration-teal-700">
            Biography
          </span>
        </span>
      </span>
    </button>
  );
}

function SpeakerCard({ person, onOpen }: { person: Person; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-haspopup="dialog" className="group flex h-full w-full flex-col justify-start text-left">
      <span className="relative block aspect-[4/5] overflow-hidden bg-surface-100">
        {person.photo && (
          <Image src={person.photo} alt="" fill sizes="(min-width:1024px) 240px, 60vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        )}
      </span>
      <span className="mt-4 block text-[13px] font-semibold text-teal-700">{roleLabel(person)}</span>
      <span className="mt-1 block font-display text-[19px] font-semibold leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {person.name}
      </span>
      <span className="mt-1 block text-[14px] leading-snug text-ink-600">{person.institution}</span>
      <Meta person={person} />
    </button>
  );
}

/* ── Slider (homepage) ───────────────────────────────────────────────── */

function Arrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous speakers" : "Next speakers"}
      className="grid size-12 place-items-center rounded-[2px] border border-navy-950/20 bg-white text-navy-950 transition-colors duration-150 hover:border-navy-950 hover:bg-navy-950 hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-white disabled:text-ink-400"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className={dir === "prev" ? "rotate-180" : ""}>
        <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function SpeakerSlider({ people }: { people: Person[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [open, setOpen] = useState<Person | null>(null);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <ul ref={track} className="snap-track -mx-4 flex items-start gap-6 overflow-x-auto px-4 pb-1 md:-mx-8 md:px-8" aria-label="Speakers">
        {people.map((p) => (
          <li key={p.id} className={p.isKeynote ? "w-[88%] shrink-0 sm:w-[520px]" : "w-[62%] shrink-0 sm:w-[240px]"}>
            {p.isKeynote ? <KeynoteCard person={p} onOpen={() => setOpen(p)} /> : <SpeakerCard person={p} onOpen={() => setOpen(p)} />}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-[14px] text-ink-600">
          {people.filter((p) => p.isKeynote).length} keynote · {people.filter((p) => !p.isKeynote).length} workshop speakers
        </p>
        <div className="flex gap-2">
          <Arrow dir="prev" disabled={edges.start} onClick={() => page(-1)} />
          <Arrow dir="next" disabled={edges.end} onClick={() => page(1)} />
        </div>
      </div>
      <SpeakerDialog person={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ── Grid (speakers page) ────────────────────────────────────────────── */

export function SpeakerGrid({ people, variant }: { people: Person[]; variant: "keynote" | "standard" }) {
  const [open, setOpen] = useState<Person | null>(null);
  return (
    <>
      <ul className={variant === "keynote" ? "grid gap-6 lg:grid-cols-2" : "grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"}>
        {people.map((p, i) => (
          <li key={p.id}>
            {variant === "keynote" ? <KeynoteCard person={p} priority={i < 2} onOpen={() => setOpen(p)} /> : <SpeakerCard person={p} onOpen={() => setOpen(p)} />}
          </li>
        ))}
      </ul>
      <SpeakerDialog person={open} onClose={() => setOpen(null)} />
    </>
  );
}
