import { useState } from "react";
import { MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { createTestimonial, removeTestimonial, subscribeAdminTestimonials, updateTestimonial } from "../../services/firestore";

const blankEntry = { quote: "", name: "", role: "", isPublished: false };
const watchTestimonials = (callback, onError) => subscribeAdminTestimonials(callback, onError);

export default function ManageTestimonials() {
  const { items, loading, error } = useCollection(watchTestimonials);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const openNew = () => { setNotice(""); setEditing({ ...blankEntry }); };
  const openEdit = (entry) => { setNotice(""); setEditing({ ...blankEntry, ...entry }); };
  const updateField = (event) => setEditing({ ...editing, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice("");
    try {
      const values = { ...editing };
      delete values.id;
      if (editing.id) await updateTestimonial(editing.id, values);
      else await createTestimonial(values);
      setEditing(null);
    } catch (reason) { setNotice(reason.message || "Could not save this testimonial."); }
    finally { setSaving(false); }
  };
  const remove = async (entry) => {
    if (!window.confirm("Delete this testimonial permanently?")) return;
    try { await removeTestimonial(entry.id); } catch (reason) { setNotice(reason.message || "Could not delete this testimonial."); }
  };

  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Client stories</p><h1 className="mt-2 text-3xl font-semibold">Testimonials</h1><p className="mt-2 text-sm text-slate-400">Publish only approved quotes with permission from the client.</p></div><button onClick={openNew} className="button-primary"><Plus size={17} /> Add testimonial</button></div>{notice && <p role="status" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{notice}</p>}{loading ? <LoadingState label="Loading testimonials" /> : error ? <p className="mt-6 text-sm text-rose-200">{error}</p> : items.length ? <div className="mt-7 grid gap-4 md:grid-cols-2">{items.map((entry) => <GlassCard key={entry.id} className="p-6"><MessageSquare className="text-blue-300" size={20} /><blockquote className="mt-4 leading-7 text-slate-200">“{entry.quote}”</blockquote><div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4"><div><p className="font-medium text-white">{entry.name}</p><p className="mt-1 text-xs text-slate-500">{entry.role || "Client"}</p><span className={"mt-3 status-pill " + (entry.isPublished ? "status-contacted" : "status-planned")}>{entry.isPublished ? "Published" : "Draft"}</span></div><div className="flex gap-2"><button className="icon-button" aria-label="Edit testimonial" onClick={() => openEdit(entry)}><Pencil size={15} /></button><button className="icon-button text-rose-200" aria-label="Delete testimonial" onClick={() => remove(entry)}><Trash2 size={15} /></button></div></div></GlassCard>)}</div> : <GlassCard className="mt-7 p-8 text-center"><MessageSquare className="mx-auto text-blue-300" size={25} /><p className="mt-3 font-medium text-white">No published stories yet</p><p className="mt-2 text-sm text-slate-400">Add a client-approved quote to feature it on the public site.</p></GlassCard>}
    <GlassModal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing && editing.id ? "Edit testimonial" : "Add testimonial"}><form onSubmit={save} className="grid gap-5"><div><label htmlFor="quote" className="field-label">Approved client quote *</label><textarea id="quote" name="quote" className="field-control min-h-36" value={editing ? editing.quote : ""} onChange={updateField} required minLength={10} maxLength={1200} /></div><div><label htmlFor="name" className="field-label">Client name or attribution *</label><input id="name" name="name" className="field-control" value={editing ? editing.name : ""} onChange={updateField} required maxLength={120} /></div><div><label htmlFor="role" className="field-label">Role or company (optional)</label><input id="role" name="role" className="field-control" value={editing ? editing.role : ""} onChange={updateField} maxLength={160} /></div><label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="isPublished" checked={Boolean(editing && editing.isPublished)} onChange={updateField} className="h-4 w-4 accent-blue-500" />Publish on the public site</label><div className="flex justify-end gap-3"><button type="button" className="button-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save testimonial"}</button></div></form></GlassModal></div>;
}
