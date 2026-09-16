import type { HelpMode, Source } from "./course-engine";

export type Interaction = {
  id: string; question: string; topic: string; mode: HelpMode; createdAt: string; resolved: boolean;
};
export type Escalation = {
  id: string; student: string; question: string; topic: string; mode: HelpMode; coachSummary: string;
  sources: Source[]; createdAt: string; status: "New" | "Replied"; reply?: string;
};
export type ApprovedFaq = { id: string; question: string; answer: string; topic: string; createdAt: string };

const defaults: Escalation[] = [
  { id:"sample-1", student:"Alice M.", question:"If VIF is high, do I always have to remove a predictor?", topic:"Multicollinearity and VIF", mode:"explain", coachSummary:"Explained that VIF is diagnostic evidence, not an automatic deletion rule.", sources:[{title:"Linear Models II",location:"Multicollinearity and VIF"}], createdAt:new Date(Date.now()-24*60*1000).toISOString(), status:"New" },
  { id:"sample-2", student:"Priya S.", question:"My pipeline still sends strings to LinearRegression.", topic:"One-hot encoding and categorical predictors", mode:"debug", coachSummary:"Suggested inspecting dtypes and the output of fit_transform.", sources:[{title:"Insurance Modeling Notebook",location:"Preprocessing pipeline"}], createdAt:new Date(Date.now()-58*60*1000).toISOString(), status:"New" }
];

function read<T>(key:string, fallback:T):T {
  if (typeof window === "undefined") return fallback;
  try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function write<T>(key:string,value:T){ if(typeof window!=="undefined"){ localStorage.setItem(key,JSON.stringify(value)); window.dispatchEvent(new Event("course-hub-update")); } }
export const store = {
  interactions: () => read<Interaction[]>("ds6021_interactions",[]),
  addInteraction: (item:Interaction) => write("ds6021_interactions",[item,...read<Interaction[]>("ds6021_interactions",[])]),
  escalations: () => read<Escalation[]>("ds6021_escalations",defaults),
  addEscalation: (item:Escalation) => write("ds6021_escalations",[item,...read<Escalation[]>("ds6021_escalations",defaults)]),
  updateEscalation: (id:string,reply:string) => write("ds6021_escalations",read<Escalation[]>("ds6021_escalations",defaults).map(x=>x.id===id?{...x,status:"Replied" as const,reply}:x)),
  faqs: () => read<ApprovedFaq[]>("ds6021_faqs",[]),
  addFaq: (item:ApprovedFaq) => write("ds6021_faqs",[item,...read<ApprovedFaq[]>("ds6021_faqs",[])])
};
