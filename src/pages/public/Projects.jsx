import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
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
  const bannerImage = displayItems[0]?.imageUrl || demoImages.hero;
  const filtered = useMemo(() => category === "All" ? displayItems : displayItems.filter((project) => (project.category || "").toLowerCase().includes(category.toLowerCase())), [displayItems, category]);

  return <>
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
      <img src={bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl"><p className="eyebrow">Projects</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Projects we have chosen to share.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Browse our project photos and details. Select a project to see more.</p></div>
    </section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto max-w-7xl pt-8"><div className="mb-7 flex flex-wrap gap-2">{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={"rounded-full border px-4 py-2 text-sm transition " + (category === name ? "border-amber-300/50 bg-amber-300/10 text-white" : "border-white/10 bg-slate-950/30 text-slate-400 hover:text-white")}>{name}</button>)}</div>{loading ? <LoadingState label="Loading projects" /> : <>
      {showingDemos && <p className="mb-6 border-l-2 border-amber-300/70 pl-4 text-sm leading-6 text-slate-300">Illustrative sample images are shown until company projects are published. They are not completed or commissioned projects.</p>}
      {error && <p className="mb-5 text-xs text-slate-500">The project list is temporarily unavailable.</p>}
      {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((project) => <button key={project.id} type="button" className="group overflow-hidden rounded-xl border border-white/10 bg-slate-950/35 text-left transition hover:border-amber-300/40" onClick={() => setSelected(project)}><div className="relative h-56 bg-slate-900"><img src={project.imageUrl || demoImages.hero} alt={project.title + " image"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" /><span className="absolute left-4 top-4 rounded bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white">{project.isDemo ? "Illustrative concept" : project.status || "Project"}</span></div><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-200">{project.category}</p><h2 className="mt-2 text-lg font-semibold text-white">{project.title}</h2>{!project.isDemo && <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin size={14} />{project.location || "Location not listed"}</p>}</div></button>)}</div> : <GlassCard className="p-8"><h2 className="text-lg font-semibold text-white">No projects in this category yet</h2></GlassCard>}
    </>}</div></section>
    <GlassModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? selected.title : "Project details"} wide>
      {selected && <div className="grid gap-6 md:grid-cols-[1.05fr_.95fr]"><div>{selected.imageUrl ? <img src={selected.imageUrl} alt={selected.title + " cover"} className="max-h-[26rem] w-full rounded-lg object-cover" /> : <div className="min-h-64 rounded-lg bg-slate-900" />}{Array.isArray(selected.gallery) && selected.gallery.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{selected.gallery.map((image, index) => { const url = resolveImageUrl(image); return url ? <img key={image.publicId || url || index} src={url} alt={selected.title + " gallery " + (index + 1)} className="h-20 w-full rounded-lg object-cover" /> : null; })}</div>}</div><div><p className="text-xs uppercase tracking-wider text-amber-200">{selected.category} · {selected.status}</p>{selected.isDemo && <p className="mt-3 border-l-2 border-amber-300/70 pl-3 text-sm leading-6 text-slate-300">Illustrative sample concept. This is not an actual client or completed company project.</p>}{!selected.isDemo && <p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><MapPin size={15} />{selected.location || "Location not listed"}</p>}{selected.client && <p className="mt-2 text-sm text-slate-400">Client: {selected.client}</p>}<p className="mt-5 leading-7 text-slate-300">{selected.description || selected.summary || "Project details will be added by the team."}</p>{selected.summary && selected.description && <p className="mt-4 text-sm leading-6 text-slate-400">{selected.summary}</p>}</div></div>}
    </GlassModal>
  </>;
}
