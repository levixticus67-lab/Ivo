import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages } from "../../data/demoImagery";
import { resolveImageUrl } from "../../utils/images";

const values = [
  { title: "Precision", text: "We pay attention to detail, keep clear records, and make choices that work on site." },
  { title: "Coordination", text: "We bring engineering, design, client needs and site work together." },
  { title: "Accountability", text: "We set clear expectations, raise issues early and follow through." },
  { title: "Continuous improvement", text: "We learn from each stage and improve how the next project is delivered." },
];
const capabilities = [
  { title: "Executive leadership", text: "Guide the project, keep the client aligned and support decisions at each stage." },
  { title: "Engineering & design", text: "Connect structural and architectural design to each project’s brief." },
  { title: "Site delivery", text: "Plan construction, coordinate site work and check quality as work progresses." },
];
const standards = [
  { title: "Quality control", text: "Site checks and documented reviews follow the agreed scope and applicable requirements." },
  { title: "Safety planning", text: "Project-specific risk assessment, site induction and safety coordination." },
  { title: "Verified credentials", text: "Certifications and statutory approvals are shared only after they are confirmed for the company and project." },
];

export default function About() {
  const { settings } = useSiteSettings();
  const aboutImage = resolveImageUrl(settings.aboutImage) || demoImages.about;
  return <>
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
      <img src={aboutImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/10" />
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Isometric Designs and Construction Company Limited</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">We work across commercial construction, residential design and build, civil infrastructure, structural engineering and interior renovation. We bring these services together in one coordinated offer.</p>
      </div>

    </section>
    <section className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2"><GlassCard className="p-7 sm:p-9"><p className="eyebrow">Our mission</p><h2 className="mt-3 text-2xl font-semibold text-white">Turn project goals into clear plans and careful construction.</h2><p className="mt-4 leading-7 text-slate-300">We turn client goals into practical design and engineering decisions, then carry those decisions through construction with care.</p></GlassCard><GlassCard className="p-7 sm:p-9"><p className="eyebrow">Our vision</p><h2 className="mt-3 text-2xl font-semibold text-white">A built environment shaped by thoughtful coordination.</h2><p className="mt-4 leading-7 text-slate-300">We want to be a trusted partner for projects where structural integrity, functional design and responsible execution all matter.</p></GlassCard></div></section>
    <section className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What guides us" title="Our values" /><div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">{values.map((value) => <div key={value.title}><h3 className="font-semibold text-white">{value.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{value.text}</p></div>)}</div></div></section>
    <section className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="People & practice" title="Different skills, working together" description="These capability groups describe the roles involved in delivery." /><div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-3">{capabilities.map((item) => <div key={item.title}><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p></div>)}</div></div></section>
    <section className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Responsible delivery" title="Quality, safety and compliance" /><div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-3">{standards.map((item) => <div key={item.title}><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p></div>)}</div><p className="mt-6 text-xs text-slate-500">We do not list third-party certifications or project credentials unless verified.</p></div></section>
  </>;
}
