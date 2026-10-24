import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import LoadingState from "../../components/common/LoadingState";
import { isFirebaseConfigured } from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";
import { saveSiteSettings, subscribeSiteSettings } from "../../services/firestore";

const watchSettings = (callback, onError) => subscribeSiteSettings((settings) => callback([settings]), onError);
const emptySettings = { address: "", phone: "", email: "", workingHours: "", mapLink: "", tagline: "Engineering Precision. Structural Excellence. Innovative Designs." };
export default function Settings() {
  const { items, loading, error } = useCollection(watchSettings);
  const [form, setForm] = useState(emptySettings);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { if (items[0]) setForm({ ...emptySettings, ...items[0] }); }, [items]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setNotice("");
    try { await saveSiteSettings(form); setNotice("Site contact settings saved."); }
    catch (reason) { setNotice(reason.message || "Could not save settings."); }
    finally { setSaving(false); }
  };
  if (loading) return <LoadingState label="Loading site settings" />;
  return <div className="mx-auto max-w-4xl"><div><p className="eyebrow">Public site</p><h1 className="mt-2 text-3xl font-semibold">Site settings</h1><p className="mt-2 text-sm text-slate-400">Set verified contact details shown on the public site.</p></div><GlassCard className="mt-7 p-6 sm:p-8"><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">{[{ name: "address", label: "Office address", placeholder: "Confirmed office address" }, { name: "phone", label: "Phone number", placeholder: "+256 …" }, { name: "email", label: "Contact email", placeholder: "office@example.com" }, { name: "workingHours", label: "Working hours", placeholder: "Days and hours" }, { name: "mapLink", label: "Map link", placeholder: "https://maps.google.com/…" }, { name: "tagline", label: "Company tagline", placeholder: "Company tagline" }].map((field) => <div key={field.name}><label className="field-label" htmlFor={field.name}>{field.label}</label><input className="field-control" id={field.name} name={field.name} value={form[field.name] || ""} onChange={change} placeholder={field.placeholder} type={field.name === "email" ? "email" : field.name === "mapLink" ? "url" : "text"} maxLength={240} /></div>)}{error && <p className="text-sm text-rose-200 sm:col-span-2">{error}</p>}{notice && <p role="status" className="text-sm text-emerald-200 sm:col-span-2">{notice}</p>}<div className="sm:col-span-2"><button className="button-primary" disabled={saving || !isFirebaseConfigured}><Save size={16} />{saving ? "Saving…" : "Save site settings"}</button></div></form></GlassCard><p className="mt-5 text-xs leading-5 text-slate-500">Only publish company contact details after they have been confirmed. The Firestore rules require an administrator claim for these changes.</p></div>;
}
