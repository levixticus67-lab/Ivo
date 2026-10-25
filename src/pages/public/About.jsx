import { BadgeCheck, ClipboardCheck, HardHat, ShieldCheck, Target, Users, Waypoints } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages } from "../../data/demoImagery";
import { resolveImageUrl } from "../../utils/images";

const values = [
  { title: "Precision", text: "Make decisions with care, clear documentation, and attention to the details that affect buildability." },
  { title: "Coordination", text: "Bring engineering, design, client needs, and site delivery into the same conversation." },
  { title: "Accountability", text: "Set clear expectations, surface issues early, and follow through on agreed actions." },
  { title: "Continuous improvement", text: "Learn from each stage of a project and improve the way the next one is delivered." },
];
const capabilities = [
  { icon: Users, title: "Executive leadership", text: "Project direction, client alignment, and decision-making across the delivery lifecycle." },
  { icon: Target, title: "Engineering & design", text: "Structural and architectural coordination shaped by each project brief." },
  { icon: HardHat, title: "Site delivery", text: "Construction planning, site coordination, and quality checks through execution." },
];
const standards = [
  { icon: ClipboardCheck, title: "Quality control", text: "Inspection points and documented review aligned to the scope and applicable requirements." },
  { icon: ShieldCheck, title: "Safety planning", text: "Project-specific risk assessment, induction, and site safety coordination." },
  { icon: BadgeCheck, title: "Verified credentials", text: "Certifications and statutory approvals are published only when confirmed for the company and project." },
];

export default function About() {
  const { settings } = useSiteSettings();
  const hasCustomAboutImage = Boolean(resolveImageUrl(settings.aboutImage));
  const aboutImage = resolveImageUrl(settings.aboutImage) || demoImages.about;
  return <>
    <section className="px-4 pb-16 pt-12 sm:px-6 sm:pt-20"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]"><div><p className="eyebrow">About Isometric Designs</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Engineering judgment, delivered with clarity.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Isometric Designs Company Limited brings commercial construction, residential design and build, civil infrastructure, structural engineering, and interior renovation into one coordinated offer.</p></div><div className="glass-panel overflow-hidden p-2"><img src={aboutImage} alt={hasCustomAboutImage ? "Company profile feature image" : "Illustrative design concept"} className="h-64 w-full rounded-2xl object-cover sm:h-80" /><p className="px-3 py-2 text-xs text-slate-400">{hasCustomAboutImage ? "Image selected by the site administrator." : "Illustrative concept image — replace with a company-approved photograph."}</p></div></div></section>
    <section className="px-4 py-12 sm:px-6"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2"><GlassCard className="p-7 sm:p-9"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-300"><Target size={22} /></span><p className="eyebrow mt-6">Our mission</p><h2 className="mt-3 text-2xl font-semibold">Coordinate good thinking with dependable delivery.</h2><p className="mt-4 leading-7 text-slate-300">We aim to turn client goals into practical design and engineering decisions, then carry those decisions through construction with care.</p></GlassCard><GlassCard className="p-7 sm:p-9"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/10 text-sky-200"><Waypoints size={22} /></span><p className="eyebrow mt-6">Our vision</p><h2 className="mt-3 text-2xl font-semibold">A built environment shaped by thoughtful coordination.</h2><p className="mt-4 leading-7 text-slate-300">We want to be a trusted partner for projects where structural integrity, functional design, and responsible execution all matter.</p></GlassCard></div></section>
    <section className="px-4 py-16 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What guides us" title="Values that show up in the work" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map((value) => <GlassCard key={value.title} className="p-6"><h3 className="font-semibold text-white">{value.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{value.text}</p></GlassCard>)}</div></div></section>
    <section className="px-4 py-16 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="People & practice" title="Connected expertise, not isolated handoffs" description="These capability groups describe the roles involved in delivery. Individual names and biographies can be added once the company confirms who should be featured." /><div className="grid gap-4 md:grid-cols-3">{capabilities.map(({ icon: Icon, title, text }) => <GlassCard key={title} className="p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Icon size={19} /></span><h3 className="mt-5 font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></GlassCard>)}</div></div></section>
    <section className="px-4 py-16 sm:px-6"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Responsible delivery" title="Quality, safety, and compliance are built into the process" /><div className="grid gap-4 md:grid-cols-3">{standards.map(({ icon: Icon, title, text }) => <GlassCard key={title} className="p-6"><Icon className="text-blue-300" size={22} /><h3 className="mt-5 font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></GlassCard>)}</div><p className="mt-5 text-xs text-slate-500">No third-party certification or project credential is claimed on this page. Add verified details before publishing them.</p></div></section>
  </>;
}
