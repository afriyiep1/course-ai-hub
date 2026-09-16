import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#111d35]">
      <header className="border-b border-[#d8e0ec] bg-white px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#232d4b] text-white"><Sparkles size={20} /></div>
            <div><p className="font-semibold leading-tight">Course AI Hub</p><p className="text-sm text-[#5f6b7c]">DS 6021 · Fall 2026</p></div>
          </div>
          <span className="rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-3 py-1 text-sm font-medium">Pilot workspace</span>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e7efff] px-3 py-1.5 text-sm font-semibold text-[#1c4b9b]"><ShieldCheck size={16} /> Course-grounded support</p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl">Two workspaces. One human-centered support system.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526176]">Choose the student learning coach for course-specific guidance, or the private TA workspace for escalations and teaching insights.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link href="/student" className="group rounded-3xl border border-[#cad5e5] bg-white p-7 shadow-[0_14px_40px_rgba(35,45,75,0.08)] transition hover:-translate-y-1 hover:border-[#5981c8]">
            <div className="mb-12 flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7efff] text-[#1c4b9b]"><GraduationCap size={26} /></div><ArrowRight className="text-[#8290a5] transition group-hover:translate-x-1 group-hover:text-[#1c4b9b]" /></div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#446596]">For students</p><h2 className="mt-2 text-2xl font-semibold">Learning Coach</h2>
            <p className="mt-3 leading-7 text-[#5f6b7c]">Get a hint, unpack a concept, debug code, or test your understanding—with course citations and a path to a TA.</p>
          </Link>
          <Link href="/ta" className="group rounded-3xl bg-[#232d4b] p-7 text-white shadow-[0_18px_45px_rgba(35,45,75,0.2)] transition hover:-translate-y-1">
            <div className="mb-12 flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e57200] text-white"><BookOpenCheck size={25} /></div><ArrowRight className="text-[#aebbd2] transition group-hover:translate-x-1 group-hover:text-white" /></div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#b8c8e4]">For teaching staff</p><h2 className="mt-2 text-2xl font-semibold">TA Copilot</h2>
            <p className="mt-3 leading-7 text-[#d4dceb]">Review escalations, spot misconceptions early, draft feedback, and turn approved responses into reusable course guidance.</p>
          </Link>
        </div>
        <p className="mt-8 text-sm text-[#68768a]">Prototype access selector · Production access will be controlled by Canvas role through LTI 1.3.</p>
      </section>
    </main>
  );
}
