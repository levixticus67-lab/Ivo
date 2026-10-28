import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import LoadingState from "../../components/common/LoadingState";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { useCollection } from "../../hooks/useCollection";
import { saveSiteSettings, subscribeSiteSettings } from "../../services/firestore";
import { resolveImageUrl } from "../../utils/images";

const watchCollaborators = (callback, onError) => subscribeSiteSettings((settings) => callback(Array.isArray(settings.collaborators) ? settings.collaborators : []), onError);
const makeId = () => Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
const blankEntry = { id: "", name: "", role: "", portrait: null, isPublished: false };

function initials(name) {
  return (name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "?";
}

export default function ManageCollaborators() {
  const { items, loading, error } = useCollection(watchCollaborators);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const openNew = () => { setNotice(""); setEditing({ ...blankEntry, id: makeId() }); };
  const openEdit = (entry) => { setNotice(""); setEditing({ ...blankEntry, ...entry }); };
  const updateField = (event) => setEditing({ ...editing, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const next = editing.id && items.some((item) => item.id === editing.id)
        ? items.map((item) => item.id === editing.id ? editing : item)
        : [...items, editing];
      await saveSiteSettings({ collaborators: next });
      setEditing(null);
      setNotice("Collaborator saved.");
    } catch (reason) {
      setNotice(reason.message || "Could not save this collaborator.");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (entry) => {
    if (!window.confirm("Remove " + entry.name + " from the public collaborators list?")) return;
    setNotice("");
    try {
      await saveSiteSettings({ collaborators: items.filter((item) => item.id !== entry.id) });
      setNotice("Collaborator removed.");
    } catch (reason) {
      setNotice(reason.message || "Could not remove this collaborator.");
    }
  };

  if (loading) return <LoadingState label="Loading collaborators" />;
  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Public site</p><h1 className="mt-2 text-3xl font-semibold">Collaborators</h1><p className="mt-2 text-sm text-slate-400">Add names, roles and profile photos. Publish only profiles approved for public sharing.</p></div><button onClick={openNew} className="button-primary"><Plus size={17} /> Add collaborator</button></div>{notice && <p role="status" className="mt-5 rounded-xl border border-white/10 bg-white/[.04] p-3 text-sm text-slate-200">{notice}</p>}{error && <p role="alert" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{error}</p>}{items.length ? <div className="mt-7 grid gap-4 md:grid-cols-2">{items.map((entry) => <GlassCard key={entry.id} className="flex items-center gap-4 p-5"><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-sm font-semibold text-blue-200">{resolveImageUrl(entry.portrait) ? <img src={resolveImageUrl(entry.portrait)} alt={entry.name} className="h-full w-full object-cover" /> : initials(entry.name)}</div><div className="min-w-0 flex-1"><p className="truncate font-medium text-white">{entry.name}</p><p className="mt-1 truncate text-sm text-slate-400">{entry.role || "Role not added"}</p><span className={"mt-2 inline-flex status-pill " + (entry.isPublished ? "status-contacted" : "status-planned")}>{entry.isPublished ? "Published" : "Hidden"}</span></div><div className="flex shrink-0 gap-2"><button className="icon-button" aria-label={"Edit " + entry.name} onClick={() => openEdit(entry)}><Pencil size={15} /></button><button className="icon-button text-rose-200" aria-label={"Remove " + entry.name} onClick={() => remove(entry)}><Trash2 size={15} /></button></div></GlassCard>)}</div> : <GlassCard className="mt-7 p-7"><p className="font-medium text-white">No collaborators added yet.</p><p className="mt-2 text-sm text-slate-400">Add a name and role, then upload a photo to show their profile on the public site.</p></GlassCard>}
    <GlassModal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing && items.some((item) => item.id === editing.id) ? "Edit collaborator" : "Add collaborator"}><form onSubmit={save} className="grid gap-5"><div><label htmlFor="name" className="field-label">Name *</label><input id="name" name="name" className="field-control" value={editing ? editing.name : ""} onChange={updateField} required minLength={2} maxLength={120} /></div><div><label htmlFor="role" className="field-label">Role or company (optional)</label><input id="role" name="role" className="field-control" value={editing ? editing.role : ""} onChange={updateField} maxLength={160} /></div><ImageUploadField label="Profile photo (optional)" scope="collaborator" value={editing && editing.portrait} onChange={(asset) => setEditing({ ...editing, portrait: asset })} helper="This small photo appears beside their name on the public site." /><label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="isPublished" checked={Boolean(editing && editing.isPublished)} onChange={updateField} className="h-4 w-4 accent-blue-500" />Show on the public site</label><div className="flex justify-end gap-3"><button type="button" className="button-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save collaborator"}</button></div></form></GlassModal>
  </div>;
}
