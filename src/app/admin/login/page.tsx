import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

async function Gate() {
  if (await getAdmin()) redirect("/admin");
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <p className="mb-8 text-center font-display text-[32px] font-semibold leading-none">
          iCONICS<span className="text-teal-700">’26</span>
        </p>
        <div className="rounded-[2px] border border-line bg-white p-6 shadow-[0_12px_32px_rgba(11,27,51,0.08)] sm:p-8">
          <h1 className="text-[24px] leading-tight">Admin sign in</h1>
          <p className="mt-1 text-[15px] text-ink-600">Conference management for organisers.</p>
          <div className="mt-6">
            <Suspense fallback={<p className="text-[15px] text-ink-600">Loading…</p>}>
              <Gate />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
