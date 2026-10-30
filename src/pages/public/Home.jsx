import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages } from "../../data/demoImagery";
import { services } from "../../data/services";
import { resolveImageUrl } from "../../utils/images";
import { subscribePublicProjects, subscribeTestimonials } from "../../services/firestore";

function initials(name) {
  return (name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "C";
}

export default function Home() {
  const { items: projects, loading: projectsLoading, error: projectsError } = useCollection(subscribePublicProjects);
  const { items: testimonials } = useCollection(subscribeTestimonials);
  const { settings } = useSiteSettings();
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = window.setInterval(() => setQuoteIndex((index) => (index + 1) % testimonials.length), 6500);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);
  const featured = projects.slice(0, 3);
  const currentQuote = testimonials.length ? testimonials[quoteIndex % testimonials.length] : null;
  const heroImage = resolveImageUrl(settings.heroImage) || demoImages.hero;
  const previewServices = services.filter((service) => service.id !== "management");
  const collaborators = Array.isArray(settings.collaborators) ? settings.collaborators.filter((entry) => entry && entry.isPublished) : [];

  return <>
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/10" />
      <motion.div className="relative mx-auto grid w-full max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_.9fr]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
        <div>
          <p className="eyebrow">Design · Engineering · Build</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">From first plans to a finished project.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">One coordinated team for commercial construction, residential design and build, civil infrastructure, structural engineering, and interior renovation.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="button-primary w-full sm:w-auto" to="/contact">Request a quote</Link><Link className="button-secondary w-full sm:w-auto" to="/projects">View projects</Link></div>
          <div className="mt-10 grid gap-4 border-t border-white/20 pt-6 text-sm text-slate-200 sm:grid-cols-3"><span><strong className="block text-xl text-white">5</strong>connected disciplines</span><span><strong className="block text-xl text-white">One</strong>team from start to handover</span><span><strong className="block text-xl text-white">Built</strong>around your brief</span></div>
        </div>
        <div className="max-w-sm border-l-2 border-amber-300 bg-slate-950/70 p-5 backdrop-blur-sm sm:p-6 lg:ml-auto">
          <p className="eyebrow">Integrated project delivery</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">A considered approach to every structure.</h2>
          <p className="mt-3 text-sm text-slate-300">Plan · Coordinate · Deliver</p>
          <div className="mt-6 border-t border-white/15 pt-4"><p className="font-semibold text-white">Precision in every detail</p><p className="mt-1 text-sm text-slate-300">From first sketch to handover</p></div>
        </div>
      </motion.div>

    </section>

    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Our services" title="Services for each stage of your project" description="We bring design, engineering and construction together from the start." /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{previewServices.map((service, index) => { const image = resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) || demoImages.services[service.imageKey]; return <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><GlassCard hover className="h-full overflow-hidden p-0"><div className="relative h-44 overflow-hidden"><img src={image} alt="" className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" /><span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-white">{service.title}</span></div><div className="p-5"><p className="text-sm leading-6 text-slate-300">{service.intro}</p><Link to="/services" className="mt-5 inline-flex text-sm font-semibold text-amber-200 hover:text-white">Explore service</Link></div></GlassCard></motion.div>; })}</div></div></section>

    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeading eyebrow="Projects" title={projects.length ? "Selected work" : "Projects"} description={projects.length ? "See the projects our team has chosen to share." : undefined} /><Link to="/projects" className="button-secondary mb-10">All projects</Link></div>{projectsLoading ? <LoadingState label="Loading projects" /> : projectsError ? <div role="status" className="rounded-xl border border-white/10 bg-slate-950/35 p-6 text-sm text-slate-300">Published projects are temporarily unavailable. Please try again later.</div> : featured.length > 0 ? <><div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-400"><span className="status-pill">Published projects</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((project) => { const image = resolveImageUrl(project.imageUrl); return <Link key={project.id} to="/projects" className="group overflow-hidden rounded-xl border border-white/10 bg-slate-950/35"><div className="relative h-56 overflow-hidden bg-slate-900">{image ? <img src={image} alt={project.title + " project image"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" /> : <div className="grid h-full place-items-center text-xs text-slate-500" role="img" aria-label="Project image not provided">Image not provided</div>}<span className="absolute left-4 top-4 rounded bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white">{project.isDemo ? "Illustrative concept" : project.category || "Project"}</span></div><div className="p-5">{!project.isDemo && <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">{project.category}</p>}<h3 className="mt-2 font-semibold text-white">{project.title}</h3>{!project.isDemo && project.location && <p className="mt-2 text-sm text-slate-400">{project.location}</p>}</div></Link>; })}</div></> : <GlassCard className="p-7 text-center sm:p-9"><h3 className="text-lg font-semibold text-white">No project case studies have been published yet</h3><p className="mt-2 text-sm leading-6 text-slate-400">Published project details will appear here when they are added.</p><Link to="/contact" className="mt-5 inline-flex text-sm font-semibold text-amber-200 hover:text-white">Talk to our team</Link></GlassCard>}</div></section>

    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><SectionHeading eyebrow="How we work" title="Clear steps. One coordinated team." description="We keep your brief, design decisions and site work connected." /><Link to="/about" className="inline-flex text-sm font-semibold text-amber-200 hover:text-white">More about us</Link></div><div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-3">{[{ n: "01", title: "Understand", text: "Clarify scope, constraints, site context and success criteria." }, { n: "02", title: "Design & coordinate", text: "Resolve details across disciplines before work reaches site." }, { n: "03", title: "Deliver & verify", text: "Manage execution, quality checks and a considered handover." }].map((step) => <div key={step.n}><span className="text-sm font-semibold tracking-[.2em] text-amber-300">{step.n}</span><h3 className="mt-4 font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></div>)}</div></div></section>

    {currentQuote && <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Client stories" title="What our clients say" align="center" /><GlassCard className="relative p-7 text-center sm:p-10"><div className="mx-auto grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-amber-300/30 bg-slate-800 text-lg font-semibold text-amber-200">{resolveImageUrl(currentQuote.portrait) ? <img src={resolveImageUrl(currentQuote.portrait)} alt={currentQuote.name} className="h-full w-full object-cover" /> : initials(currentQuote.name)}</div><blockquote className="mt-5 text-xl leading-8 text-white sm:text-2xl">“{currentQuote.quote || currentQuote.text}”</blockquote><p className="mt-5 text-sm font-semibold text-white">{currentQuote.name}</p><p className="mt-1 text-xs text-slate-400">{currentQuote.role || currentQuote.company || "Client"}</p>{testimonials.length > 1 && <div className="mt-6 flex justify-center gap-2"><button className="icon-button" aria-label="Previous testimonial" onClick={() => setQuoteIndex((quoteIndex + testimonials.length - 1) % testimonials.length)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next testimonial" onClick={() => setQuoteIndex((quoteIndex + 1) % testimonials.length)}><ChevronRight size={18} /></button></div>}</GlassCard></div></section>}

    {collaborators.length > 0 && <section className="px-4 py-10 sm:px-6 sm:py-14"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Partners & collaborators" title="Better work comes from good coordination" align="center" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{collaborators.map((person) => <div key={person.id || person.name} className="flex items-center gap-4 border-t border-white/15 py-4"><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-amber-300/30 bg-slate-800 text-sm font-semibold text-amber-200">{resolveImageUrl(person.portrait) ? <img src={resolveImageUrl(person.portrait)} alt={person.name} className="h-full w-full object-cover" loading="lazy" /> : initials(person.name)}</div><div className="min-w-0"><p className="truncate font-semibold text-white">{person.name}</p>{person.role && <p className="mt-1 truncate text-sm text-slate-400">{person.role}</p>}</div></div>)}</div></div></section>}

    <section className="px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-white/15 py-8 sm:flex-row sm:items-center sm:py-10"><div><p className="eyebrow">Start a conversation</p><h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Have a project in mind?</h2><p className="mt-2 text-slate-300">Share the brief. We’ll help you shape the next practical step.</p></div><div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><Link to="/contact" className="button-primary w-full shrink-0 sm:w-auto">Talk to our team</Link>{settings.mapLink && <a className="button-secondary w-full sm:w-auto" href={settings.mapLink} target="_blank" rel="noreferrer">Open location <MapPin size={15} /></a>}</div></div></section>
  </>;
}
