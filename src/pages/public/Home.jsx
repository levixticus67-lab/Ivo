import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Quote, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages, demoProjects } from "../../data/demoImagery";
import { services } from "../../data/services";
import { resolveImageUrl } from "../../utils/images";
import { subscribePublicProjects, subscribeTestimonials } from "../../services/firestore";

export default function Home() {
  const { items: projects, loading: projectsLoading } = useCollection(subscribePublicProjects);
  const { items: testimonials } = useCollection(subscribeTestimonials);
  const { settings } = useSiteSettings();
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = window.setInterval(() => setQuoteIndex((index) => (index + 1) % testimonials.length), 6500);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);
  const displayProjects = projects.length ? projects : demoProjects;
  const featured = displayProjects.slice(0, 3);
  const currentQuote = testimonials.length ? testimonials[quoteIndex % testimonials.length] : null;
  const hasCustomHero = Boolean(resolveImageUrl(settings.heroImage));
  const heroImage = resolveImageUrl(settings.heroImage) || demoImages.hero;
  const previewServices = services.filter((service) => service.id !== "management");

  return <>
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.12fr_.88fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          <p className="eyebrow">Design · Engineering · Build</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">Transforming visions into <span className="text-blue-300">structural reality.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Engineering Precision. Structural Excellence. Innovative Designs. One coordinated team for construction, engineering, infrastructure, and interiors.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link className="button-primary" to="/projects">View portfolio <ArrowRight size={17} /></Link><Link className="button-secondary" to="/contact">Request a quote <ArrowUpRight size={16} /></Link></div>
          <div className="mt-11 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-sm text-slate-400"><span><strong className="text-white">5</strong> integrated disciplines</span><span><strong className="text-white">One</strong> coordinated delivery path</span><span><strong className="text-white">Built</strong> around your brief</span></div>
        </motion.div>
        <motion.div className="relative" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }}>
          <div className="glass-panel relative min-h-[360px] overflow-hidden sm:min-h-[450px]">
            <img src={heroImage} alt="Illustrative architecture concept for Isometric Designs" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-blue-950/25" />
            <div className="relative flex min-h-[360px] flex-col justify-between p-6 sm:min-h-[450px] sm:p-9">
              <div className="flex items-start justify-between"><span className="rounded-full border border-blue-200/30 bg-slate-950/45 px-3 py-1.5 text-xs text-blue-50 backdrop-blur-md">Integrated project delivery</span><Ruler className="text-white drop-shadow" size={23} /></div>
              <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-100/80">{hasCustomHero ? "Selected company image" : "Concept imagery"}</p><h2 className="mt-2 max-w-sm text-2xl font-semibold text-white drop-shadow sm:text-3xl">A considered approach to every structure.</h2><p className="mt-3 text-sm text-blue-50/80">Plan · Coordinate · Deliver</p></div>
            </div>
          </div>
          <div className="glass-panel absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:-left-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Ruler size={18} /></span><span><strong className="block text-sm text-white">Precision in every detail</strong><small className="text-slate-400">From first sketch to handover</small></span></div>
        </motion.div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What we do" title="One partner across the full project lifecycle" description="Bring design, engineering, and delivery into closer alignment from the start." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{previewServices.map((service, index) => { const Icon = service.icon; const image = resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) || demoImages.services[service.imageKey]; return <motion.div key={service.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><GlassCard hover className="h-full p-5"><div className="relative mb-5 h-40 overflow-hidden rounded-xl"><img src={image} alt={service.title + (resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) ? " image" : " concept image")} className="h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" /><span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-slate-950/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80">{resolveImageUrl(settings.serviceImages && settings.serviceImages[service.id]) ? "Selected service image" : "Illustrative image"}</span></div><span className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/15 bg-blue-500/10 text-blue-300"><Icon size={20} /></span><h3 className="mt-4 text-lg font-semibold text-white">{service.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{service.intro}</p><Link to="/services" className="mt-5 inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white">Explore service <ArrowRight size={15} /></Link></GlassCard></motion.div>; })}</div></div></section>

    <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeading eyebrow="Selected work" title={projects.length ? "Projects shaped around real briefs" : "Portfolio imagery to explore"} description={projects.length ? "Explore the portfolio published by our team." : "Illustrative concepts preview the portfolio until company projects are published."} /><Link to="/projects" className="button-secondary mb-10">All projects <ArrowUpRight size={15} /></Link></div>{projectsLoading ? <LoadingState label="Loading projects" /> : <><div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-400"><span className="status-pill">{projects.length ? "Published portfolio" : "Illustrative sample set"}</span>{!projects.length && <span>Demo images are concepts for layout testing, not completed company projects.</span>}</div><div className="grid gap-5 md:grid-cols-3">{featured.map((project) => <Link key={project.id} to="/projects" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]"><div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-900/70 via-slate-800 to-sky-900/60"><img src={project.imageUrl || demoImages.hero} alt={project.title + " concept"} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><span className="absolute left-4 top-4 status-pill bg-slate-950/70 text-white">{project.isDemo ? "Illustrative concept" : project.category || "Project"}</span><span className="absolute bottom-4 right-4 rounded-full bg-slate-950/55 px-3 py-1 text-xs text-white/80">{project.category}</span></div><div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-white">{project.title}</h3><ArrowUpRight size={17} className="text-slate-500 transition group-hover:text-blue-200" /></div><p className="mt-2 text-sm text-slate-400">{project.location}</p></div></Link>)}</div></>}</div></section>

    <section className="px-4 py-20 sm:px-6"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><SectionHeading eyebrow="How we work" title="Clear coordination. Better decisions." description="A practical process keeps the client brief, engineering decisions, and site delivery connected." /><Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white">Our approach <ArrowRight size={16} /></Link></div><div className="grid gap-3 sm:grid-cols-3">{[{ n: "01", title: "Understand", text: "Clarify scope, constraints, site context, and success criteria." }, { n: "02", title: "Design & coordinate", text: "Resolve details across disciplines before work reaches site." }, { n: "03", title: "Deliver & verify", text: "Manage execution, quality checks, and a considered handover." }].map((step) => <GlassCard key={step.n} className="p-5"><span className="text-xs font-semibold tracking-[.2em] text-blue-300">{step.n}</span><h3 className="mt-8 font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></GlassCard>)}</div></div></section>

    <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Client perspective" title="Built on clear communication" align="center" />{currentQuote ? <GlassCard className="relative min-h-56 p-7 text-center sm:p-10"><div className="mx-auto grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-white/10 bg-blue-500/15 text-blue-300">{resolveImageUrl(currentQuote.portrait) ? <img src={resolveImageUrl(currentQuote.portrait)} alt={currentQuote.name} className="h-full w-full object-cover" /> : <Quote size={25} />}</div><blockquote className="mt-5 text-xl leading-8 text-white sm:text-2xl">“{currentQuote.quote || currentQuote.text}”</blockquote><p className="mt-5 text-sm font-semibold text-blue-200">{currentQuote.name}</p><p className="mt-1 text-xs text-slate-400">{currentQuote.role || currentQuote.company || "Client"}</p>{testimonials.length > 1 && <div className="mt-6 flex justify-center gap-2"><button className="icon-button" aria-label="Previous testimonial" onClick={() => setQuoteIndex((quoteIndex + testimonials.length - 1) % testimonials.length)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next testimonial" onClick={() => setQuoteIndex((quoteIndex + 1) % testimonials.length)}><ChevronRight size={18} /></button></div>}</GlassCard> : <GlassCard className="p-8 text-center"><p className="text-slate-300">Verified client stories will be shared here as they are approved for publication.</p><p className="mt-2 text-xs text-slate-500">Testimonials are managed from the project database.</p></GlassCard>}</div></section>

    <section className="px-4 py-14 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Partners & collaborators" title="Better outcomes come from good coordination" description="Approved partner names and marks can be featured here once the company confirms permission to publish them." align="center" /><div className="glass-panel flex min-h-24 flex-wrap items-center justify-center gap-4 px-6 py-5 text-center text-sm text-slate-500"><span className="rounded-full border border-white/10 px-4 py-2">Design collaborators</span><span className="rounded-full border border-white/10 px-4 py-2">Construction partners</span><span className="rounded-full border border-white/10 px-4 py-2">Project stakeholders</span></div></div></section>

    <section className="px-4 pb-24 pt-10 sm:px-6"><div className="glass-panel mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="eyebrow">Start a conversation</p><h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Have a project in mind?</h2><p className="mt-2 text-slate-300">Share the brief. We’ll help you shape the next practical step.</p></div><Link to="/contact" className="button-primary shrink-0">Talk to our team <ArrowUpRight size={16} /></Link></div></section>
  </>;
}
