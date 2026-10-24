import { useState } from "react";
import { ArrowUpRight, Building2, Check, HardHat, Layers, Ruler, Wrench } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";

const services = [
  { icon: Building2, title: "Commercial construction", intro: "Build and fit-out delivery for commercial spaces.", details: ["Scope and feasibility coordination", "Construction planning and contractor coordination", "Progress, quality, and handover checks"] },
  { icon: Ruler, title: "Structural & architectural design", intro: "Design services that connect intent with buildable decisions.", details: ["Brief development and concept coordination", "Structural design coordination", "Technical documentation and design reviews"] },
  { icon: Layers, title: "Civil engineering & infrastructure", intro: "Civil works planned around the needs of the site and the wider project.", details: ["Site and infrastructure planning", "Civil design coordination", "Construction-stage technical support"] },
  { icon: Wrench, title: "High-end renovations", intro: "Careful upgrades for spaces that need a new standard of function or finish.", details: ["Existing-condition review", "Interior scope and finish coordination", "Phased delivery planning"] },
  { icon: HardHat, title: "Project management", intro: "Practical oversight across scope, programme, communication, and delivery.", details: ["Project setup and milestone planning", "Risk and decision tracking", "Progress reporting and close-out coordination"] },
];

export default function Services() {
  const [selected, setSelected] = useState(null);
  return <>
    <section className="px-4 pb-14 pt-12 sm:px-6 sm:pt-20"><div className="mx-auto max-w-7xl"><p className="eyebrow">Our services</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">The right expertise at every project stage.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Select a discipline to see the typical scope. Final services and deliverables are agreed for each project.</p></div></section>
    <section className="px-4 pb-24 sm:px-6"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map(({ icon: Icon, title, intro }, index) => <GlassCard key={title} hover className="flex min-h-64 flex-col p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/15 bg-blue-500/10 text-blue-300"><Icon size={21} /></span><h2 className="mt-5 text-xl font-semibold text-white">{title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{intro}</p><button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white" onClick={() => setSelected(services[index])}>View typical scope <ArrowUpRight size={15} /></button></GlassCard>)}</div></section>
    <GlassModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? selected.title : "Service details"}>
      {selected && <><p className="text-slate-300">{selected.intro}</p><h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-blue-200">Typical scope</h3><ul className="mt-4 grid gap-3">{selected.details.map((detail) => <li key={detail} className="flex gap-3 text-sm leading-6 text-slate-300"><Check className="mt-1 shrink-0 text-emerald-300" size={16} />{detail}</li>)}</ul><p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Scope is tailored to the project brief, local requirements, and the professional appointments agreed with the client.</p></>}
    </GlassModal>
  </>;
}
