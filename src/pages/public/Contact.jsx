import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import SectionHeading from "../../components/common/SectionHeading";
import { isFirebaseConfigured } from "../../firebase/config";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { demoImages } from "../../data/demoImagery";
import { resolveImageUrl } from "../../utils/images";
import { submitQuoteToApi } from "../../services/api";
import { createQuote } from "../../services/firestore";

const initialForm = { name: "", email: "", phone: "", company: "", projectType: "Commercial Construction", budget: "", location: "", timeline: "", description: "" };
const projectTypes = ["Commercial Construction", "Residential Design & Build", "Civil Infrastructure", "Structural Engineering", "Interior Renovation", "Other"];
const budgets = ["To be discussed", "Under $25,000", "$25,000–$100,000", "$100,000–$500,000", "$500,000+", "Prefer not to say"];

export default function Contact() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const setField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      await createQuote(form);
      let relayFailed = false;
      try { await submitQuoteToApi(form); } catch (_error) { relayFailed = true; }
      setNotice({ type: "success", text: relayFailed ? "Your quote is saved. The secondary service could not be reached, but the team can still see your request in the inbox." : "Your quote request is in. The team will review your brief and follow up." });
      setForm(initialForm);
    } catch (error) {
      setNotice({ type: "error", text: error.message || "We couldn't submit your request. Please try again." });
    } finally {
      setSending(false);
    }
  };
  const hasCustomContactImage = Boolean(resolveImageUrl(settings.contactImage));
  const contactImage = resolveImageUrl(settings.contactImage) || demoImages.contact;

  return <>
    <section className="px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-16"><div className="mx-auto max-w-7xl"><p className="eyebrow">Contact</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Tell us what you’re planning.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Tell us a little about your project so we can prepare for a useful first conversation.</p></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_.9fr]"><GlassCard className="p-6 sm:p-8"><SectionHeading eyebrow="Project inquiry" title="Request a quote" description="Fields marked with an asterisk are required." /><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2"><div><label className="field-label" htmlFor="name">Name *</label><input className="field-control" id="name" name="name" value={form.name} onChange={setField} autoComplete="name" required minLength={2} maxLength={120} /></div><div><label className="field-label" htmlFor="email">Email *</label><input className="field-control" id="email" name="email" type="email" value={form.email} onChange={setField} autoComplete="email" required /></div><div><label className="field-label" htmlFor="phone">Phone</label><input className="field-control" id="phone" name="phone" type="tel" value={form.phone} onChange={setField} autoComplete="tel" /></div><div><label className="field-label" htmlFor="company">Company</label><input className="field-control" id="company" name="company" value={form.company} onChange={setField} autoComplete="organization" /></div><div><label className="field-label" htmlFor="projectType">Project type *</label><select className="field-control" id="projectType" name="projectType" value={form.projectType} onChange={setField} required>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></div><div><label className="field-label" htmlFor="budget">Estimated budget</label><select className="field-control" id="budget" name="budget" value={form.budget} onChange={setField}><option value="">Select a range</option>{budgets.map((budget) => <option key={budget}>{budget}</option>)}</select></div><div><label className="field-label" htmlFor="location">Site location *</label><input className="field-control" id="location" name="location" value={form.location} onChange={setField} required maxLength={160} /></div><div><label className="field-label" htmlFor="timeline">Target timeline</label><input className="field-control" id="timeline" name="timeline" value={form.timeline} onChange={setField} placeholder="e.g. planning this quarter" maxLength={100} /></div><div className="sm:col-span-2"><label className="field-label" htmlFor="description">Project description *</label><textarea className="field-control min-h-32 resize-y" id="description" name="description" value={form.description} onChange={setField} required minLength={10} maxLength={3000} placeholder="What are you looking to build, change, or solve?" /></div><div className="sm:col-span-2">{notice && <p role="status" className={"mb-4 rounded-xl border p-3 text-sm " + (notice.type === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-rose-300/20 bg-rose-300/10 text-rose-100")}>{notice.text}</p>}{!isFirebaseConfigured && <p className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">Quote submission is not available yet.</p>}<button className="button-primary w-full sm:w-auto" type="submit" disabled={sending || !isFirebaseConfigured}>{sending ? "Sending request…" : "Send project brief"}<Send size={16} /></button><p className="mt-3 text-xs leading-5 text-slate-500">Your details are used to respond to this inquiry.</p></div></form></GlassCard>
      <div className="space-y-5"><GlassCard className="p-6 sm:p-8"><SectionHeading eyebrow="Reach us" title="Contact details" description="Verified contact details will appear here once confirmed." /><div className="grid gap-4">{settings.address && <div className="flex gap-3 text-sm text-slate-300"><MapPin size={18} className="mt-0.5 shrink-0 text-blue-300" /><span>{settings.address}</span></div>}{settings.phone && <a href={"tel:" + settings.phone} className="flex gap-3 text-sm text-slate-300 hover:text-white"><Phone size={18} className="text-blue-300" />{settings.phone}</a>}{settings.email && <a href={"mailto:" + settings.email} className="flex gap-3 text-sm text-slate-300 hover:text-white"><Mail size={18} className="text-blue-300" />{settings.email}</a>}{settings.workingHours && <div className="flex gap-3 text-sm text-slate-300"><Clock size={18} className="text-blue-300" />{settings.workingHours}</div>}{!settings.address && !settings.phone && !settings.email && !settings.workingHours && <p className="text-sm leading-6 text-slate-400">Office address, phone, email, and working hours will appear here when the company has confirmed and added them.</p>}</div>{settings.mapLink && <a className="button-secondary mt-6" href={settings.mapLink} target="_blank" rel="noreferrer">Open location <MapPin size={15} /></a>}</GlassCard><div className="glass-panel relative min-h-64 overflow-hidden"><img src={contactImage} alt={hasCustomContactImage ? "Company contact feature image" : "Illustrative interior design concept"} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" /><div className="relative flex min-h-64 flex-col justify-end p-6"><span className="text-xs font-semibold uppercase tracking-[.18em] text-blue-100">{hasCustomContactImage ? "Selected company image" : "Illustrative concept image"}</span><p className="mt-2 text-lg font-semibold text-white">A good project starts with a clear conversation.</p><p className="mt-2 max-w-xs text-sm text-slate-200/80">Share your site location in the quote form and we’ll plan around its context.</p></div></div></div></div></section>
  </>;
}
