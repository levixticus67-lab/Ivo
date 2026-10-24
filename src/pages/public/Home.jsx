import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Building2, ChevronLeft, ChevronRight, HardHat, Layers, Quote, Ruler, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { subscribePublicProjects, subscribeTestimonials } from "../../services/firestore";
import { isFirebaseConfigured } from "../../firebase/config";

const services = [
  { icon: Building2, title: "Commercial construction", text: "Coordinated delivery for workplaces, retail, and commercial facilities." },
  { icon: Ruler, title: "Structural & architectural design", text: "Buildable design solutions aligned with function, safety, and context." },
  { icon: Layers, title: "Civil infrastructure", text: "Civil works planned around resilient systems and practical site delivery." },
  { icon: Wrench, title: "Interior renovations", text: "Thoughtful upgrades that improve how existing spaces work and feel." },
];

export default function Home() {
  const { items: projects, loading: projectsLoading } = useCollection(subscribePublicProjects);
  const { items: testimonials } = useCollection(subscribeTestimonials);
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = window.setInterval(() => setQuoteIndex((index) => (index + 1) % testimonials.length), 6500);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);
  const featured = projects.slice(0, 3);
  const currentQuote = testimonials.length ? testimonials[quoteIndex % testimonials.length] : null;

  return (
    <>
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
            <div className="glass-panel relative min-h-[360px] overflow-hidden p-6 sm:min-h-[450px] sm:p-9">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-sky-400/10" />
              <div className="absolute right-[-12%] top-[8%] h-64 w-64 rounded-full border border-blue-300/15" /><div className="absolute right-[3%] top-[22%] h-44 w-44 rounded-full border border-blue-300/20" />
              <div className="relative flex h-full min-h-[310px] flex-col justify-between sm:min-h-[390px]">
                <div className="flex items-start justify-between"><span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-100">Integrated project delivery</span><HardHat className="text-blue-200" size={23} /></div>
                <div className="relative mx-auto grid h-52 w-full max-w-sm place-items-center sm:h-64">
                  <div className="absolute h-40 w-56 skew-y-[-28deg] border border-blue-200/30 bg-gradient-to-br from-blue-300/15 to-blue-950/35 shadow-glow sm:h-48 sm:w-64" />
                  <div className="absolute left-[18%] top-[19%] h-28 w-36 skew-y-[-28deg] border border-white/20 bg-slate-200/5 sm:h-36 sm:w-44" />
                  <div className="absolute right-[17%] top-[32%] h-20 w-28 skew-y-[-28deg] border border-sky-200/35 bg-sky-400/10 sm:h-24 sm:w-32" />
                  <div className="absolute bottom-[8%] left-[14%] right-[10%] h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-xs text-slate-400"><span>Plan</span><span className="text-center">Coordinate</span><span className="text-right">Deliver</span></div>
              </div>
            </div>
            <div className="glass-panel absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:-left-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Ruler size={18} /></span><span><strong className="block text-sm text-white">Precision in every detail</strong><small className="text-slate-400">From first sketch to handover</small></span></div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What we do" title="One partner across the full project lifecycle" description="Bring design, engineering, and delivery into closer alignment from the start." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(({ icon: Icon, title, text }, index) => <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><GlassCard hover className="h-full p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/15 bg-blue-500/10 text-blue-300"><Icon size={21} /></span><h3 className="mt-5 text-lg font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p><Link to="/services" className="mt-5 inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white">Explore service <ArrowRight size={15} /></Link></GlassCard></motion.div>)}</div></div></section>

      <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-5"><SectionHeading eyebrow="Selected work" title="Projects shaped around real briefs" description="Explore the portfolio published by our team." /><Link to="/projects" className="button-secondary mb-10">All projects <ArrowUpRight size={15} /></Link></div>{projectsLoading ? <LoadingState label="Loading projects" /> : featured.length ? <div className="grid gap-5 md:grid-cols-3">{featured.map((project) => <Link key={project.id} to="/projects" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]"><div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-900/70 via-slate-800 to-sky-900/60">{project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-blue-200/60"><Building2 size={46} strokeWidth={1} /></div>}<span className="absolute left-4 top-4 status-pill bg-slate-950/60 text-white">{project.category || "Project"}</span></div><div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-white">{project.title}</h3><ArrowUpRight size={17} className="text-slate-500 transition group-hover:text-blue-200" /></div><p className="mt-2 text-sm text-slate-400">{project.location || "Location available on request"}</p></div></Link>)}</div> : <GlassCard className="flex flex-col items-start gap-3 p-7"><p className="font-medium text-white">The public portfolio is being prepared.</p><p className="text-sm text-slate-400">Published projects will appear here as the team adds them in the admin dashboard.{!isFirebaseConfigured ? " Configure Firebase to connect the portfolio." : ""}</p><Link to="/contact" className="mt-2 text-sm text-blue-200">Discuss your project <ArrowRight size={14} className="ml-1 inline" /></Link></GlassCard>}</div></section>

      <section className="px-4 py-20 sm:px-6"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><SectionHeading eyebrow="How we work" title="Clear coordination. Better decisions." description="A practical process keeps the client brief, engineering decisions, and site delivery connected." /><Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white">Our approach <ArrowRight size={16} /></Link></div><div className="grid gap-3 sm:grid-cols-3">{[{ n: "01", title: "Understand", text: "Clarify scope, constraints, site context, and success criteria." }, { n: "02", title: "Design & coordinate", text: "Resolve details across disciplines before work reaches site." }, { n: "03", title: "Deliver & verify", text: "Manage execution, quality checks, and a considered handover." }].map((step) => <GlassCard key={step.n} className="p-5"><span className="text-xs font-semibold tracking-[.2em] text-blue-300">{step.n}</span><h3 className="mt-8 font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></GlassCard>)}</div></div></section>

      <section className="px-4 py-20 sm:px-6"><div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Client perspective" title="Built on clear communication" align="center" />{currentQuote ? <GlassCard className="relative min-h-56 p-7 text-center sm:p-10"><Quote className="mx-auto text-blue-300" size={27} /><blockquote className="mt-5 text-xl leading-8 text-white sm:text-2xl">“{currentQuote.quote || currentQuote.text}”</blockquote><p className="mt-5 text-sm font-semibold text-blue-200">{currentQuote.name}</p><p className="mt-1 text-xs text-slate-400">{currentQuote.role || currentQuote.company || "Client"}</p>{testimonials.length > 1 && <div className="mt-6 flex justify-center gap-2"><button className="icon-button" aria-label="Previous testimonial" onClick={() => setQuoteIndex((quoteIndex + testimonials.length - 1) % testimonials.length)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Next testimonial" onClick={() => setQuoteIndex((quoteIndex + 1) % testimonials.length)}><ChevronRight size={18} /></button></div>}</GlassCard> : <GlassCard className="p-8 text-center"><p className="text-slate-300">Verified client stories will be shared here as they are approved for publication.</p><p className="mt-2 text-xs text-slate-500">Testimonials are managed from the project database.</p></GlassCard>}</div></section>

      <section className="px-4 py-14 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Partners & collaborators" title="Better outcomes come from good coordination" description="Approved partner names and marks can be featured here once the company confirms permission to publish them." align="center" /><div className="glass-panel flex min-h-24 flex-wrap items-center justify-center gap-4 px-6 py-5 text-center text-sm text-slate-500"><span className="rounded-full border border-white/10 px-4 py-2">Design collaborators</span><span className="rounded-full border border-white/10 px-4 py-2">Construction partners</span><span className="rounded-full border border-white/10 px-4 py-2">Project stakeholders</span></div></div></section>

      <section className="px-4 pb-24 pt-10 sm:px-6"><div className="glass-panel mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="eyebrow">Start a conversation</p><h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Have a project in mind?</h2><p className="mt-2 text-slate-300">Share the brief. We’ll help you shape the next practical step.</p></div><Link to="/contact" className="button-primary shrink-0">Talk to our team <ArrowUpRight size={16} /></Link></div></section>
    </>
  );
}
