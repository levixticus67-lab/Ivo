import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import LoadingState from "../../components/common/LoadingState";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { isFirebaseConfigured } from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";
import { saveSiteSettings, subscribeSiteSettings } from "../../services/firestore";
import { services } from "../../data/services";

const watchSettings = (callback, onError) => subscribeSiteSettings((settings) => callback([settings]), onError);
const emptySettings = { address: "", phone: "", email: "", workingHours: "", mapLink: "", tagline: "Engineering Precision. Structural Excellence. Innovative Designs.", serviceImages: {}, socialLinks: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "" } };
const socialFields = [
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page" },
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-profile" },
  { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/your-company" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel" },
  { name: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@your-profile" },
];

export default function Settings() {
  const { items, loading, error } = useCollection(watchSettings);
  const [form, setForm] = useState(emptySettings);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { if (items[0]) setForm({ ...emptySettings, ...items[0], serviceImages: items[0].serviceImages || {}, socialLinks: { ...emptySettings.socialLinks, ...(items[0].socialLinks || {}) } }); }, [items]);
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const setImage = (name, asset) => setForm((current) => ({ ...current, [name]: asset }));
  const changeSocialLink = (name, value) => setForm((current) => ({ ...current, socialLinks: { ...(current.socialLinks || {}), [name]: value } }));
  const setServiceImage = (serviceId, asset) => setForm((current) => ({ ...current, serviceImages: { ...(current.serviceImages || {}), [serviceId]: asset } }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setNotice("");
    try { await saveSiteSettings(form); setNotice("Site settings, social links, and imagery saved. Published images are now live on the public site."); }
    catch (reason) { setNotice(reason.message || "Could not save settings."); }
    finally { setSaving(false); }
  };
  if (loading) return <LoadingState label="Loading site settings" />;
  const fields = [{ name: "address", label: "Office address", placeholder: "Confirmed office address" }, { name: "phone", label: "Phone number", placeholder: "+256 …" }, { name: "email", label: "Contact email", placeholder: "office@example.com" }, { name: "workingHours", label: "Working hours", placeholder: "Days and hours" }, { name: "mapLink", label: "Map link", placeholder: "https://maps.google.com/…" }, { name: "tagline", label: "Company tagline", placeholder: "Company tagline" }];
  return <div className="mx-auto max-w-5xl"><div><p className="eyebrow">Public site</p><h1 className="mt-2 text-3xl font-semibold">Site settings</h1><p className="mt-2 text-sm text-slate-400">Manage verified contact details, social links, and images used across public pages.</p></div>
    <GlassCard className="mt-7 p-6 sm:p-8"><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><h2 className="text-lg font-semibold text-white">Contact details</h2><p className="mt-1 text-sm text-slate-400">Only enter contact information confirmed by the company.</p></div>{fields.map((field) => <div key={field.name}><label className="field-label" htmlFor={field.name}>{field.label}</label><input className="field-control" id={field.name} name={field.name} value={form[field.name] || ""} onChange={change} placeholder={field.placeholder} type={field.name === "email" ? "email" : field.name === "mapLink" ? "url" : "text"} maxLength={240} /></div>)}
      <div className="sm:col-span-2 mt-3 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold text-white">Social media</h2><p className="mt-1 text-sm leading-6 text-slate-400">Add the company profile URLs to show their icons in the public site footer. Leave a field blank to hide that icon.</p></div>
      {socialFields.map((field) => <div key={field.name}><label className="field-label" htmlFor={`social-${field.name}`}>{field.label} URL</label><input className="field-control" id={`social-${field.name}`} type="url" maxLength={500} value={(form.socialLinks && form.socialLinks[field.name]) || ""} onChange={(event) => changeSocialLink(field.name, event.target.value)} placeholder={field.placeholder} /></div>)}
      <div className="sm:col-span-2 mt-3 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold text-white">Public page imagery</h2></div>
      <ImageUploadField label="Homepage hero" scope="hero" value={form.heroImage} onChange={(asset) => setImage("heroImage", asset)} />
      <ImageUploadField label="About page feature" scope="about" value={form.aboutImage} onChange={(asset) => setImage("aboutImage", asset)} />
      <div className="sm:col-span-2"><ImageUploadField label="Contact page feature" scope="contact" value={form.contactImage} onChange={(asset) => setImage("contactImage", asset)} /></div>
      <div className="sm:col-span-2 mt-3 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold text-white">Service images</h2></div>
      {services.map((service) => <ImageUploadField key={service.id} label={service.title} scope="service" value={form.serviceImages && form.serviceImages[service.id]} onChange={(asset) => setServiceImage(service.id, asset)} compact />)}
      {error && <p className="text-sm text-rose-200 sm:col-span-2">{error}</p>}{notice && <p role="status" className="text-sm text-emerald-200 sm:col-span-2">{notice}</p>}
      <div className="sm:col-span-2"><button className="button-primary" disabled={saving || !isFirebaseConfigured}><Save size={16} />{saving ? "Saving…" : "Save site settings, social links & images"}</button></div>
    </form></GlassCard>
  </div>;
}
