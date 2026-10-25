import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages } from "../../data/demoImagery";
import { services } from "../../data/services";
import { resolveImageUrl } from "../../utils/images";

export default function Services() {
  const [selected, setSelected] = useState(null);
  const { settings } = useSiteSettings();
  const imageFor = (service) => resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) || demoImages.services[service.imageKey];
  return <>
    <section className="px-4 pb-14 pt-12 sm:px-6 sm:pt-20"><div className="mx-auto max-w-7xl"><p className="eyebrow">Our services</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">The right expertise at every project stage.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Select a discipline to see the typical scope. Final services and deliverables are agreed for each project.</p></div></section>
    <section className="px-4 pb-24 sm:px-6"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((service, index) => { const Icon = service.icon; return <GlassCard key={service.id} hover className="flex min-h-96 flex-col p-5"><div className="relative mb-5 h-48 overflow-hidden rounded-xl"><img src={imageFor(service)} alt={service.title + (resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) ? " image" : " concept image")} className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" /><span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-slate-950/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80">{resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) ? "Selected service image" : "Illustrative image"}</span></div><span className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/15 bg-blue-500/10 text-blue-300"><Icon size={20} /></span><h2 className="mt-4 text-xl font-semibold text-white">{service.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{service.intro}</p><button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white" onClick={() => setSelected(service)}>View typical scope <ArrowUpRight size={15} /></button></GlassCard>; })}</div></section>
    <GlassModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? selected.title : "Service details"} wide>
      {selected && <><img src={imageFor(selected)} alt={selected.title + " concept image"} className="mb-6 h-56 w-full rounded-xl object-cover sm:h-72" /><p className="text-xs font-medium uppercase tracking-wider text-blue-200">Illustrative service image</p><p className="mt-3 text-slate-300">{selected.intro}</p><h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-blue-200">Typical scope</h3><ul className="mt-4 grid gap-3">{selected.details.map((detail) => <li key={detail} className="flex gap-3 text-sm leading-6 text-slate-300"><Check className="mt-1 shrink-0 text-emerald-300" size={16} />{detail}</li>)}</ul><p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Scope is tailored to the project brief, local requirements, and the professional appointments agreed with the client.</p></>}
    </GlassModal>
  </>;
}
