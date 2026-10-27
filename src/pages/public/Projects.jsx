import { useMemo, useState } from "react";
import { Building2, MapPin } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { subscribePublicProjects } from "../../services/firestore";
import { demoImages, demoProjects } from "../../data/demoImagery";
import { resolveImageUrl } from "../../utils/images";

const categories = ["All", "Commercial", "Residential", "Infrastructure"];

export default function Projects() {
  const { items, loading, error } = useCollection(subscribePublicProjects);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const displayItems = items.length ? items : demoProjects;
  const showingDemos = items.length === 0;
  const filtered = useMemo(() => category === "All" ? displayItems : displayItems.filter((project) => (project.category || "").toLowerCase().includes(category.toLowerCase())), [displayItems, category]);

  return <>
    <section className="px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-16"><div className="mx-auto max-w-7xl"><p className="eyebrow">Portfolio</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">Work that starts with a clear brief.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Browse the projects our team has chosen to share. Each card opens the published project details.</p></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto max-w-7xl"><div className="mb-8 flex flex-wrap gap-2">{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={"rounded-full border px-4 py-2 text-sm transition " + (category === name ? "border-blue-300/40 bg-blue-500/20 text-white" : "border-white/10 bg-white/[.03] text-slate-400 hover:text-white")}>{name}</button>)}</div>{loading ? <LoadingState label="Loading portfolio" /> : <>
      {showingDemos && <div className="mb-6 rounded-xl border border-amber-200/15 bg-amber-200/[.06] p-4 text-sm leading-6 text-amber-100/90"><strong>Illustrative sample images:</strong> These are not completed or commissioned company projects. Published projects will replace these samples.</div>}
      {error && <p className="mb-5 text-xs text-slate-500">The live portfolio is temporarily unavailable; showing illustrative sample content.</p>}
      {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((project) => <button key={project.id} type="button" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] text-left transition hover:border-blue-300/30" onClick={() => setSelected(project)}><div className="relative h-56 bg-gradient-to-br from-blue-950 via-slate-800 to-sky-950"><img src={project.imageUrl || demoImages.hero} alt={project.title + (project.isDemo ? " illustrative concept" : "")} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><span className="absolute left-4 top-4 status-pill bg-slate-950/70 text-slate-100">{project.isDemo ? "Illustrative concept" : project.status || "Project"}</span></div><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs uppercase tracking-wider text-blue-200">{project.category}</span><span className="text-xs text-slate-500">View details</span></div><h2 className="mt-2 text-lg font-semibold text-white">{project.title}</h2>{!project.isDemo && <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin size={14} />{project.location || "Location not listed"}</p>}</div></button>)}</div> : <GlassCard className="p-8 text-center"><Building2 className="mx-auto text-blue-300" size={28} /><h2 className="mt-4 text-lg font-semibold text-white">No published projects in this category yet</h2></GlassCard>}
    </>}</div></section>
    <GlassModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? selected.title : "Project details"} wide>
      {selected && <div className="grid gap-6 md:grid-cols-[1.05fr_.95fr]"><div>{selected.imageUrl ? <img src={selected.imageUrl} alt={selected.title + " cover"} className="max-h-[26rem] w-full rounded-xl object-cover" /> : <div className="grid min-h-64 place-items-center rounded-xl bg-gradient-to-br from-blue-950 via-slate-800 to-sky-950 text-blue-200/50"><Building2 size={48} /></div>}{Array.isArray(selected.gallery) && selected.gallery.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{selected.gallery.map((image, index) => { const url = resolveImageUrl(image); return url ? <img key={image.publicId || url || index} src={url} alt={selected.title + " gallery " + (index + 1)} className="h-20 w-full rounded-lg object-cover" /> : null; })}</div>}</div><div><p className="text-xs uppercase tracking-wider text-blue-200">{selected.category} · {selected.status}</p>{selected.isDemo && <p className="mt-3 rounded-lg border border-amber-200/15 bg-amber-200/[.06] p-3 text-xs leading-5 text-amber-100/90">Illustrative sample concept. This is not an actual client or completed company project.</p>}{!selected.isDemo && <p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><MapPin size={15} />{selected.location || "Location not listed"}</p>}{selected.client && <p className="mt-2 text-sm text-slate-400">Client: {selected.client}</p>}<p className="mt-5 leading-7 text-slate-300">{selected.description || selected.summary || "Project details will be added by the team."}</p>{selected.summary && selected.description && <p className="mt-4 text-sm leading-6 text-slate-400">{selected.summary}</p>}</div></div>}
    </GlassModal>
  </>;
}
