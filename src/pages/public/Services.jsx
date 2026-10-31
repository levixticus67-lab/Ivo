import { useState } from "react";
import { Expand } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import ImageLightbox from "../../components/common/ImageLightbox";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { services } from "../../data/services";
import { resolveImageUrl } from "../../utils/images";

export default function Services() {
  const [selected, setSelected] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const { settings } = useSiteSettings();
  const imageFor = (service) => resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]);
  const bannerImage = imageFor(services[0]);
  return <>
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 sm:py-16">
      {bannerImage && <img src={bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl"><p className="eyebrow">Services</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Construction, design and engineering services.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Choose a service to see what it includes. We agree the final work with you.</p></div>
    </section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto grid max-w-7xl gap-5 pt-8 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <GlassCard key={service.id} hover className="flex h-full flex-col overflow-hidden p-0"><div className="relative h-52 overflow-hidden bg-slate-900">{imageFor(service) ? <button type="button" className="absolute inset-0 border-0 bg-transparent p-0 text-left cursor-zoom-in" aria-label={"View full-size " + service.title + " image"} onClick={() => setViewingImage({ src: imageFor(service), alt: service.title + " service image" })}><img src={imageFor(service)} alt="" className="h-full w-full object-cover" loading="lazy" /><span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 p-2 text-white"><Expand size={15} /></span></button> : <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />}<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" /><span className="pointer-events-none absolute bottom-4 left-4 text-xs font-medium uppercase tracking-wider text-white">{service.title}</span></div><div className="flex flex-1 flex-col p-5"><h2 className="text-xl font-semibold text-white">{service.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{service.intro}</p><button className="mt-6 self-start border-b border-amber-300/60 pb-1 text-sm font-semibold text-amber-200 hover:text-white" onClick={() => setSelected(service)}>View details</button></div></GlassCard>)}</div></section>
    <GlassModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? selected.title : "Service details"} wide>
      {selected && <>{imageFor(selected) ? <button type="button" className="group relative mb-5 block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-transparent p-0" aria-label={"View full-size " + selected.title + " image"} onClick={() => setViewingImage({ src: imageFor(selected), alt: selected.title + " service image" })}><img src={imageFor(selected)} alt={selected.title + " image"} className="h-56 w-full rounded-lg object-cover sm:h-72" /><span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 p-2 text-white"><Expand size={15} /></span></button> : <div className="mb-5 grid h-56 place-items-center rounded-lg bg-slate-900 text-sm text-slate-500 sm:h-72">No image uploaded</div>}<p className="text-xs font-medium uppercase tracking-wider text-amber-200">{selected.title}</p><p className="mt-3 text-slate-300">{selected.intro}</p><h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-amber-200">Typical scope</h3><ul className="mt-4 grid gap-3">{selected.details.map((detail) => <li key={detail} className="border-l-2 border-amber-300/60 pl-4 text-sm leading-6 text-slate-300">{detail}</li>)}</ul><p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Scope is tailored to the project brief, local requirements and the professional appointments agreed with the client.</p></>}
    </GlassModal>
    <ImageLightbox image={viewingImage} onClose={() => setViewingImage(null)} />
  </>;
}
