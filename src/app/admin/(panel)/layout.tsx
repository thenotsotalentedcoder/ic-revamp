import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { AdminNav } from "@/components/admin/nav";

/** Every page in the panel sits behind this: the session is verified (and the DB re-checked) on each request. */
async function Shell({ children }: { children: ReactNode }) {
  const me = await getAdmin();
  if (!me) redirect("/admin/login");
  return (
    <div className="lg:grid lg:grid-cols-[248px_1fr]">
      <AdminNav name={me.name} email={me.email} />
      <main id="main" className="min-w-0 px-4 py-6 sm:px-8 sm:py-9">
        {children}
      </main>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-10 text-center text-[15px] text-ink-600">Loading…</p>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
