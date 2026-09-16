"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, BookOpenCheck, Check, FilePenLine, Inbox, MessageSquareWarning, Plus, Search, Send, Sparkles } from "lucide-react";
import { courseSources } from "@/lib/course-engine";
import { store, type Escalation, type Interaction } from "@/lib/course-store";

type Tab="queue"|"insights"|"feedback"|"knowledge";

export default function TaHub(){
  const [tab,setTab]=useState<Tab>("queue");
  const [tickets,setTickets]=useState<Escalation[]>([]);
  const [interactions,setInteractions]=useState<Interaction[]>([]);
  const [selectedId,setSelectedId]=useState("");
  const [reply,setReply]=useState("");
  const [search,setSearch]=useState("");
  const [notice,setNotice]=useState("");

  function refresh(){ const next=store.escalations();setTickets(next);setInteractions(store.interactions());setSelectedId(id=>id||next[0]?.id||""); }
  useEffect(()=>{refresh();window.addEventListener("course-hub-update",refresh);return()=>window.removeEventListener("course-hub-update",refresh)},[]);
  const selected=tickets.find(x=>x.id===selectedId)||tickets[0];
  useEffect(()=>{if(selected)setReply(selected.reply||draftReply(selected));},[selectedId,tickets.length]);
  const filtered=tickets.filter(x=>(x.question+" "+x.topic+" "+x.student).toLowerCase().includes(search.toLowerCase()));

  function sendReply(){if(!selected||!reply.trim())return;store.updateEscalation(selected.id,reply.trim());setNotice("Reply approved and the escalation was marked replied.");refresh();}
  function saveFaq(){if(!selected||!reply.trim())return;store.addFaq({id:crypto.randomUUID(),question:selected.question,answer:reply.trim(),topic:selected.topic,createdAt:new Date().toISOString()});setNotice("Approved response saved to the course FAQ collection.");}

  return <main className="min-h-screen bg-[#f3f6fa] text-[#15203a]">
    <header className="sticky top-0 z-10 border-b border-[#d6dfeb] bg-[#232d4b] px-4 py-3 text-white sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><div className="flex items-center gap-3"><Link href="/" aria-label="Back" className="rounded-lg p-2 hover:bg-white/10"><ArrowLeft size={20}/></Link><div><p className="font-semibold">DS 6021 TA Copilot</p><p className="text-sm text-[#bac7dc]">Introduction to Predictive Modeling</p></div></div><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">Pilot workspace</span></div></header>
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[230px_minmax(0,1fr)] sm:px-8">
      <aside className="rounded-2xl bg-[#1b2541] p-3 text-white lg:min-h-[calc(100vh-108px)]">
        <p className="px-3 pb-3 pt-2 text-sm font-semibold text-[#aebbd2]">Teaching workspace</p>
        {([{id:"queue",label:"Escalation queue",icon:Inbox},{id:"insights",label:"Class insights",icon:BarChart3},{id:"feedback",label:"Feedback studio",icon:FilePenLine},{id:"knowledge",label:"Course knowledge",icon:BookOpenCheck}] as const).map(item=>{const Icon=item.icon;const count=item.id==="queue"?tickets.filter(x=>x.status==="New").length:0;return <button key={item.id} onClick={()=>{setTab(item.id);setNotice("")}} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold ${tab===item.id?"bg-white text-[#1b2541]":"text-[#d9e1ef] hover:bg-white/10"}`}><Icon size={18}/><span className="flex-1">{item.label}</span>{count>0&&<span className="rounded-full bg-[#e57200] px-2 py-0.5 text-xs text-white">{count}</span>}</button>})}
        <div className="mt-6 border-t border-white/15 px-3 pt-5"><p className="text-sm font-semibold">Human approval required</p><p className="mt-2 text-sm leading-6 text-[#aebbd2]">Review every AI draft before it reaches a student or becomes course guidance.</p></div>
      </aside>
      <section>
        {notice&&<div className="mb-4 flex items-center gap-2 rounded-xl bg-[#e9f7ef] p-3 font-semibold text-[#197243]"><Check size={18}/>{notice}</div>}
        {tab==="queue"&&<Queue tickets={filtered} selected={selected} select={id=>{setSelectedId(id);setNotice("")}} search={search} setSearch={setSearch} reply={reply} setReply={setReply} send={sendReply} saveFaq={saveFaq}/>}
        {tab==="insights"&&<Insights tickets={tickets} interactions={interactions}/>}
        {tab==="feedback"&&<FeedbackStudio/>}
        {tab==="knowledge"&&<Knowledge/>}
      </section>
    </div>
  </main>
}

function Queue({tickets,selected,select,search,setSearch,reply,setReply,send,saveFaq}:{tickets:Escalation[];selected?:Escalation;select:(id:string)=>void;search:string;setSearch:(x:string)=>void;reply:string;setReply:(x:string)=>void;send:()=>void;saveFaq:()=>void}){
  return <><div className="mb-5"><p className="text-sm font-semibold uppercase tracking-[.1em] text-[#61718a]">Live support</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.03em]">Escalation queue</h1></div><div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]"><div className="overflow-hidden rounded-2xl border border-[#d6dfeb] bg-white"><div className="border-b p-3"><div className="flex items-center gap-2 rounded-xl bg-[#f1f4f8] px-3 py-2"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions" className="w-full bg-transparent text-sm outline-none"/></div></div>{tickets.length?tickets.map(t=><button key={t.id} onClick={()=>select(t.id)} className={`w-full border-b p-4 text-left last:border-0 ${selected?.id===t.id?"bg-[#edf4ff]":"hover:bg-[#f8fafc]"}`}><div className="flex items-center justify-between gap-3"><span className="font-semibold">{t.student}</span><span className={`rounded-full px-2 py-1 text-xs font-semibold ${t.status==="New"?"bg-[#fff1e5] text-[#9a4b00]":"bg-[#eaf6ef] text-[#1c6c42]"}`}>{t.status}</span></div><p className="mt-1 text-sm font-semibold text-[#46658f]">{t.topic}</p><p className="mt-2 line-clamp-2 text-sm leading-5 text-[#647287]">{t.question}</p><p className="mt-2 text-xs text-[#8490a1]">{relativeTime(t.createdAt)}</p></button>):<p className="p-6 text-center text-[#66758a]">No matching escalations.</p>}</div>
    {selected?<article className="rounded-2xl border border-[#d6dfeb] bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-[#68778d]">{selected.student} · {relativeTime(selected.createdAt)}</p><h2 className="mt-2 text-xl font-semibold">{selected.question}</h2></div><MessageSquareWarning className="shrink-0 text-[#e57200]"/></div><div className="mt-5 rounded-xl border bg-[#f8fafc] p-4"><p className="text-sm font-semibold text-[#526783]">Coach attempt</p><p className="mt-2 leading-7">{selected.coachSummary}</p></div><div className="mt-5"><div className="mb-2 flex items-center gap-2 font-semibold text-[#174a9c]"><Sparkles size={17}/>Editable TA reply</div><textarea value={reply} onChange={e=>setReply(e.target.value)} rows={8} className="w-full resize-none rounded-xl border border-[#bdcada] p-4 leading-7 outline-none focus:border-[#4674bd]"/></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={send} className="flex items-center gap-2 rounded-xl bg-[#232d4b] px-4 py-2.5 font-semibold text-white"><Send size={17}/>Approve & mark replied</button><button onClick={saveFaq} className="flex items-center gap-2 rounded-xl border border-[#c8d3e1] px-4 py-2.5 font-semibold hover:bg-[#f1f5f9]"><Plus size={17}/>Save as FAQ</button></div><div className="mt-6 border-t pt-4"><p className="text-sm font-semibold text-[#526783]">Evidence available</p><p className="mt-2 text-sm text-[#66758a]">{selected.sources.map(x=>x.title+" · "+x.location).join("  •  ")}</p></div></article>:<div className="rounded-2xl border bg-white p-8 text-center text-[#66758a]">Select an escalation to review.</div>}</div></>
}

function Insights({tickets,interactions}:{tickets:Escalation[];interactions:Interaction[]}){
  const all=[...interactions.map(x=>x.topic),...tickets.map(x=>x.topic)];const counts=Object.entries(all.reduce<Record<string,number>>((a,x)=>{a[x]=(a[x]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]);const total=Math.max(1,all.length);
  return <><p className="text-sm font-semibold uppercase tracking-[.1em] text-[#61718a]">Pilot activity</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.03em]">Class insights</h1><div className="mt-6 grid gap-4 sm:grid-cols-3">{[[interactions.length,"Questions asked"],[tickets.length,"Escalations"],[tickets.filter(x=>x.status==="Replied").length,"TA replies"]].map(([v,l])=><div key={l} className="rounded-2xl border bg-white p-5"><p className="text-3xl font-semibold">{v}</p><p className="mt-1 text-[#66758a]">{l}</p></div>)}</div><div className="mt-5 rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Questions by concept</h2>{counts.length?<div className="mt-5 space-y-5">{counts.slice(0,6).map(([topic,count])=><div key={topic}><div className="mb-2 flex justify-between gap-4"><span className="font-semibold">{topic}</span><span className="text-sm text-[#66758a]">{count}</span></div><div className="h-3 overflow-hidden rounded-full bg-[#edf1f6]"><div className="h-full rounded-full bg-[#e57200]" style={{width:`${Math.max(12,(count/total)*100)}%`}}/></div></div>)}</div>:<p className="mt-4 text-[#66758a]">Use the Student Hub to generate pilot activity.</p>}</div></>
}

function FeedbackStudio(){
  const [objective,setObjective]=useState("Interpret multiple-regression coefficients in context");
  const [work,setWork]=useState("");
  const [draft,setDraft]=useState("");
  function generate(){if(!work.trim()){setDraft("Paste a de-identified student response first.");return}setDraft(`Strength: Your response identifies the predictor and the direction of the relationship.\n\nNext step: State the response unit and include “holding the other predictors constant.” Then separate statistical association from a causal claim.\n\nQuestion to consider: What would the coefficient mean for two otherwise similar observations that differ by one unit in this predictor?\n\nAligned objective: ${objective}`)}
  return <><p className="text-sm font-semibold uppercase tracking-[.1em] text-[#61718a]">Rubric-aligned drafting</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.03em]">Feedback studio</h1><div className="mt-6 grid gap-5 xl:grid-cols-2"><div className="rounded-2xl border bg-white p-5"><label className="font-semibold">Learning objective</label><input value={objective} onChange={e=>setObjective(e.target.value)} className="mt-2 w-full rounded-xl border px-3 py-3"/><label className="mt-5 block font-semibold">De-identified student response</label><textarea value={work} onChange={e=>setWork(e.target.value)} rows={9} placeholder="Paste a response without the student’s name or computing ID…" className="mt-2 w-full resize-none rounded-xl border p-3 leading-6"/><button onClick={generate} className="mt-4 flex items-center gap-2 rounded-xl bg-[#232d4b] px-4 py-2.5 font-semibold text-white"><Sparkles size={17}/>Draft feedback</button></div><div className="rounded-2xl border bg-white p-5"><p className="font-semibold">Editable draft</p><textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={16} placeholder="The feedback draft will appear here." className="mt-2 w-full resize-none rounded-xl border bg-[#fbfcfe] p-4 leading-7"/></div></div></>
}

function Knowledge(){
  const [query,setQuery]=useState("");const [faqs,setFaqs]=useState(()=>store.faqs());useEffect(()=>{const f=()=>setFaqs(store.faqs());window.addEventListener("course-hub-update",f);return()=>window.removeEventListener("course-hub-update",f)},[]);
  const sources=courseSources.filter(x=>(x.title+x.type+x.module+x.detail).toLowerCase().includes(query.toLowerCase()));
  return <><p className="text-sm font-semibold uppercase tracking-[.1em] text-[#61718a]">Grounding library</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.03em]">Course knowledge</h1><div className="mt-5 flex items-center gap-2 rounded-xl border bg-white px-3 py-3"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search sources" className="w-full outline-none"/></div><div className="mt-4 grid gap-3">{sources.map(x=><article key={x.title} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{x.title}</h2><span className="rounded-full bg-[#e9f7ef] px-2.5 py-1 text-xs font-semibold text-[#197243]">{x.status}</span></div><p className="mt-1 text-sm font-semibold text-[#526783]">{x.type} · {x.module}</p><p className="mt-3 leading-6 text-[#66758a]">{x.detail}</p></article>)}</div>{faqs.length>0&&<div className="mt-7"><h2 className="text-xl font-semibold">TA-approved FAQs</h2><div className="mt-3 space-y-3">{faqs.map(x=><article key={x.id} className="rounded-2xl border bg-white p-5"><p className="font-semibold">{x.question}</p><p className="mt-2 leading-7 text-[#5f6f85]">{x.answer}</p></article>)}</div></div>}</>
}

function draftReply(t:Escalation){return `Thanks for explaining where you are stuck. The key course idea is: ${t.coachSummary}\n\nRather than changing everything at once, apply that idea to the smallest part of your work and show what you observe. If you share the relevant variable names, output, or exact error—without submitting a complete graded solution—we can identify the next step together.`;}
function relativeTime(value:string){const mins=Math.max(1,Math.round((Date.now()-new Date(value).getTime())/60000));return mins<60?`${mins} min ago`:`${Math.round(mins/60)} hr ago`;}
