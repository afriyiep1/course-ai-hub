"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Braces, CheckCircle2, CircleHelp, Lightbulb, Send, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { answerCourseQuestion, evaluateUnderstanding, suggestedQuestions, type CoachAnswer, type HelpMode } from "@/lib/course-engine";
import { store } from "@/lib/course-store";

type Turn = { id:string; role:"student"|"coach"; text?:string; answer?:CoachAnswer; mode:HelpMode };
const modeOptions:{id:HelpMode;label:string;icon:typeof Lightbulb;description:string}[]=[
  {id:"hint",label:"Hint",icon:Lightbulb,description:"Guide me without solving it"},
  {id:"explain",label:"Explain",icon:BookOpen,description:"Build my understanding"},
  {id:"debug",label:"Debug",icon:Braces,description:"Help isolate a code problem"},
  {id:"quiz",label:"Quiz",icon:CircleHelp,description:"Test my reasoning"},
];

export default function StudentHub(){
  const [mode,setMode]=useState<HelpMode>("hint");
  const [input,setInput]=useState("");
  const [turns,setTurns]=useState<Turn[]>([]);
  const [notice,setNotice]=useState("");
  const [feedback,setFeedback]=useState<Record<string,string>>({});
  const endRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[turns]);

  function submit(question=input){
    const clean=question.trim(); if(!clean)return;
    const lastTurn=turns.at(-1);
    const isUnderstandingReply=lastTurn?.role==="coach" && lastTurn.answer?.matched;
    const answer=isUnderstandingReply
      ? evaluateUnderstanding(clean,lastTurn.answer!)
      : answerCourseQuestion(clean,mode);
    const id=crypto.randomUUID();
    setTurns(x=>[...x,{id:id+"q",role:"student",text:clean,mode},{id,role:"coach",answer,mode:isUnderstandingReply?"quiz":mode}]);
    store.addInteraction({id,question:clean,topic:answer.topic,mode,createdAt:new Date().toISOString(),resolved:answer.matched});
    setInput(""); setNotice("");
  }

  function escalate(turn:Turn){
    const question=[...turns].reverse().find(x=>x.role==="student"&&turns.indexOf(x)<turns.indexOf(turn))?.text || "Student requested TA help";
    store.addEscalation({id:crypto.randomUUID(),student:"Pilot Student",question,topic:turn.answer!.topic,mode:turn.mode,coachSummary:turn.answer!.response,sources:turn.answer!.sources,createdAt:new Date().toISOString(),status:"New"});
    setNotice("Your question and the coach’s attempt were added to the TA queue.");
  }

  return <main className="min-h-screen bg-[#f4f7fb] text-[#14203a]">
    <header className="sticky top-0 z-10 border-b border-[#d8e1ee] bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div className="flex items-center gap-3"><Link href="/" aria-label="Back" className="rounded-lg p-2 hover:bg-[#eef3fa]"><ArrowLeft size={20}/></Link><div><p className="font-semibold">DS 6021 Learning Coach</p><p className="text-sm text-[#66758b]">Introduction to Predictive Modeling</p></div></div><span className="hidden rounded-full bg-[#e9f7ef] px-3 py-1 text-sm font-semibold text-[#197243] sm:inline">8 course topics ready</span></div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[250px_minmax(0,1fr)] sm:px-8">
      <aside className="rounded-2xl border border-[#d8e1ee] bg-white p-3 lg:min-h-[calc(100vh-108px)]">
        <p className="px-3 pb-2 pt-2 text-sm font-semibold text-[#66758b]">Choose the kind of help</p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">{modeOptions.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setMode(item.id)} className={`rounded-xl p-3 text-left ${mode===item.id?"bg-[#e7efff] text-[#174a9c]":"hover:bg-[#f1f5f9]"}`}><span className="flex items-center gap-2 font-semibold"><Icon size={18}/>{item.label}</span><span className="mt-1 hidden pl-7 text-sm text-[#66758b] lg:block">{item.description}</span></button>})}</div>
        <div className="mt-5 border-t p-3"><p className="text-sm font-semibold">Try asking</p><div className="mt-3 space-y-2">{suggestedQuestions.slice(0,4).map(q=><button key={q} onClick={()=>submit(q)} className="w-full rounded-lg border border-[#dce4ee] p-2.5 text-left text-sm leading-5 hover:border-[#7796c9] hover:bg-[#f8fbff]">{q}</button>)}</div></div>
      </aside>
      <section className="flex min-h-[calc(100vh-108px)] flex-col overflow-hidden rounded-2xl border border-[#d8e1ee] bg-white shadow-[0_10px_35px_rgba(35,45,75,0.06)]">
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {turns.length===0&&<div className="mx-auto max-w-2xl py-8 text-center sm:py-16"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7efff] text-[#174a9c]"><Sparkles size={25}/></div><h1 className="mt-5 text-3xl font-semibold tracking-[-.03em]">What are you working through?</h1><p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-[#66758b]">Ask about statistical learning, experiments, regression, preprocessing, evaluation, or code from the course.</p><div className="mt-7 flex flex-wrap justify-center gap-2">{suggestedQuestions.slice(4).map(q=><button key={q} onClick={()=>submit(q)} className="rounded-full border border-[#ccd7e5] bg-[#f8fafc] px-4 py-2 text-sm font-medium hover:border-[#7796c9]">{q}</button>)}</div></div>}
          <div className="mx-auto max-w-3xl space-y-6">{turns.map(turn=>turn.role==="student"?<div key={turn.id} className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[#232d4b] px-5 py-4 leading-7 text-white">{turn.text}</div>:<article key={turn.id} className="rounded-2xl border border-[#d8e1ee] bg-[#fbfcfe] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-semibold text-[#174a9c]"><Sparkles size={18}/>{turn.answer!.topic}</div><span className="rounded-full bg-[#edf2f8] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#526783]">{turn.mode}</span></div><p className="mt-4 leading-7">{turn.answer!.response}</p>{turn.answer!.steps.length>0&&<div className="mt-4 space-y-2">{turn.answer!.steps.map((step,i)=><div key={step} className="flex gap-3 rounded-xl bg-white p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e7efff] text-xs font-bold text-[#174a9c]">{i+1}</span><p className="leading-6">{step}</p></div>)}</div>}<div className="mt-4 rounded-xl border-l-4 border-[#e57200] bg-[#fff7ed] p-4"><p className="text-sm font-semibold text-[#8a4707]">{turn.mode==="quiz"?"Your turn":"Check your understanding"}</p><p className="mt-1 leading-6">{turn.answer!.check}</p></div><div className="mt-5 border-t pt-4"><p className="text-sm font-semibold text-[#526783]">Course sources</p><div className="mt-2 flex flex-wrap gap-2">{turn.answer!.sources.map(s=><span key={s.title+s.location} className="rounded-lg border bg-white px-3 py-2 text-sm">{s.title} · {s.location}</span>)}</div></div><div className="mt-5 flex flex-wrap items-center gap-2"><button onClick={()=>setFeedback(x=>({...x,[turn.id]:"up"}))} aria-label="Helpful" className={`rounded-lg border p-2 ${feedback[turn.id]==="up"?"bg-[#e9f7ef] text-[#197243]":"hover:bg-[#f1f5f9]"}`}><ThumbsUp size={17}/></button><button onClick={()=>setFeedback(x=>({...x,[turn.id]:"down"}))} aria-label="Not helpful" className={`rounded-lg border p-2 ${feedback[turn.id]==="down"?"bg-[#fff1e5] text-[#a34f00]":"hover:bg-[#f1f5f9]"}`}><ThumbsDown size={17}/></button><button onClick={()=>escalate(turn)} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#174a9c] hover:bg-[#edf4ff]">Send this to a TA</button></div></article>)}</div>
          {notice&&<div className="mx-auto mt-5 flex max-w-3xl items-center gap-2 rounded-xl bg-[#e9f7ef] p-3 font-medium text-[#197243]"><CheckCircle2 size={18}/>{notice}</div>}
          <div ref={endRef}/>
        </div>
        <div className="border-t border-[#dfe6ef] bg-white p-4 sm:p-5"><div className="mx-auto flex max-w-3xl gap-3"><textarea aria-label="Ask a course question" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}}} placeholder={mode==="debug"?"Paste the error and say what you expected…":"Ask a DS 6021 question…"} rows={2} className="min-h-14 flex-1 resize-none rounded-2xl border border-[#bac8da] px-4 py-3 outline-none focus:border-[#4674bd] focus:ring-2 focus:ring-[#dbe8ff]"/><button onClick={()=>submit()} aria-label="Send" className="grid h-14 w-14 place-items-center self-end rounded-2xl bg-[#232d4b] text-white hover:bg-[#18213a]"><Send size={20}/></button></div><p className="mx-auto mt-2 max-w-3xl text-xs text-[#718096]">Prototype knowledge base · Verify important answers against the cited materials.</p></div>
      </section>
    </div>
  </main>
}
