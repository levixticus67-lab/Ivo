import { useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import GlassModal from "../../components/common/GlassModal";
import LoadingState from "../../components/common/LoadingState";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { useCollection } from "../../hooks/useCollection";
import { createProject, removeProject, subscribeAdminProjects, updateProject } from "../../services/firestore";
import { resolveImageUrl } from "../../utils/images";

const blankProject = { title: "", category: "Commercial", status: "Planned", location: "", imageUrl: "", imagePublicId: "", gallery: [], client: "", summary: "", description: "", isPublished: false };
const statuses = ["Planned", "Ongoing", "Completed"];
const categories = ["Commercial", "Residential", "Infrastructure"];

export default function ManageProjects() {
  const { items, loading, error } = useCollection(subscribeAdminProjects);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = items.filter((item) => (item.title + " " + item.location + " " + item.category).toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setNotice(""); setEditing({ ...blankProject, gallery: [] }); };
  const openEdit = (project) => { setNotice(""); setEditing({ ...blankProject, ...project, gallery: Array.isArray(project.gallery) ? project.gallery : [] }); };
  const setField = (event) => setEditing({ ...editing, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const setCover = (asset) => setEditing((current) => ({ ...current, imageUrl: asset ? asset.url : "", imagePublicId: asset ? asset.publicId : "" }));
  const addGalleryImage = (asset) => setEditing((current) => ({ ...current, gallery: [...(current.gallery || []), asset] }));
  const removeGalleryImage = (index) => setEditing((current) => ({ ...current, gallery: current.gallery.filter((_image, imageIndex) => imageIndex !== index) }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setNotice("");
    try {
      const values = { ...editing };
      delete values.id;
      if (editing.id) await updateProject(editing.id, values);
      else await createProject(values);
      setEditing(null);
    } catch (reason) { setNotice(reason.message || "Could not save this project."); }
    finally { setSaving(false); }
  };
  const remove = async (project) => {
    if (!window.confirm("Delete “" + project.title + "” permanently?")) return;
    try { await removeProject(project.id); } catch (reason) { setNotice(reason.message || "Could not delete this project."); }
  };

  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Portfolio</p><h1 className="mt-2 text-3xl font-semibold">Projects</h1><p className="mt-2 text-sm text-slate-400">Manage project details, upload galleries, and control public visibility.</p></div><button onClick={openNew} className="button-primary"><Plus size={17} /> Add project</button></div>{notice && <p role="status" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{notice}</p>}<GlassCard className="mt-7 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:px-6"><div><p className="font-medium">Project records</p><p className="mt-1 text-xs text-slate-500">{items.length} total</p></div><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input className="field-control w-60 pl-9" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>{loading ? <LoadingState label="Loading projects" /> : error ? <p className="p-6 text-sm text-rose-200">{error}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Project</th><th className="px-4 py-4">Category</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Visibility</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{filtered.map((project) => <tr key={project.id} className="hover:bg-white/[.025]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">{project.imageUrl && <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />}</div><div><p className="font-medium text-slate-200">{project.title}</p><p className="mt-1 text-xs text-slate-500">{project.location}</p></div></div></td><td className="px-4 py-4 text-slate-400">{project.category}</td><td className="px-4 py-4"><span className={"status-pill status-" + (project.status || "planned").toLowerCase()}>{project.status}</span></td><td className="px-4 py-4 text-slate-400">{project.isPublished ? "Published" : "Draft"}</td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button className="icon-button" aria-label={"Edit " + project.title} onClick={() => openEdit(project)}><Pencil size={15} /></button><button className="icon-button text-rose-200" aria-label={"Delete " + project.title} onClick={() => remove(project)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="p-8 text-center text-sm text-slate-500">No matching projects.</p>}</div>}</GlassCard>
    <GlassModal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing && editing.id ? "Edit project" : "Add project"} wide>{editing && <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}><div><label className="field-label" htmlFor="title">Title *</label><input className="field-control" id="title" name="title" value={editing.title} onChange={setField} required maxLength={160} /></div><div><label className="field-label" htmlFor="category">Category</label><select className="field-control" id="category" name="category" value={editing.category} onChange={setField}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div><label className="field-label" htmlFor="status">Status</label><select className="field-control" id="status" name="status" value={editing.status} onChange={setField}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div><label className="field-label" htmlFor="location">Location</label><input className="field-control" id="location" name="location" value={editing.location} onChange={setField} maxLength={160} /></div><div><label className="field-label" htmlFor="client">Client (optional)</label><input className="field-control" id="client" name="client" value={editing.client} onChange={setField} maxLength={160} /></div>
      <ImageUploadField label="Cover image" scope="project-cover" value={editing.imageUrl ? { url: editing.imageUrl, publicId: editing.imagePublicId } : null} onChange={setCover} helper="Upload the project cover. Save the project to publish this image." />
      <div className="sm:col-span-2"><label className="field-label" htmlFor="summary">Short summary</label><input className="field-control" id="summary" name="summary" value={editing.summary} onChange={setField} maxLength={240} /></div><div className="sm:col-span-2"><label className="field-label" htmlFor="description">Project details</label><textarea className="field-control min-h-28" id="description" name="description" value={editing.description} onChange={setField} maxLength={3000} /></div>
      <div className="sm:col-span-2 rounded-xl border border-white/10 bg-white/[.025] p-4"><div className="flex items-center gap-2"><ImagePlus className="text-blue-300" size={17} /><h3 className="font-medium">Project gallery</h3></div><p className="mt-1 text-xs text-slate-500">Upload images one at a time. They appear in the public project details after you save.</p><div className="mt-4"><ImageUploadField label="Add gallery image" scope="project-gallery" value={null} onChange={addGalleryImage} compact helper="Each image is uploaded with the button, not by pasting a URL." /></div>{editing.gallery && editing.gallery.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{editing.gallery.map((image, index) => { const url = resolveImageUrl(image); return url ? <div key={image.publicId || url || index} className="relative overflow-hidden rounded-lg border border-white/10"><img src={url} alt={"Gallery image " + (index + 1)} className="h-24 w-full object-cover" /><button type="button" aria-label="Remove gallery image" className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-slate-950/80 text-white" onClick={() => removeGalleryImage(index)}><X size={14} /></button></div> : null; })}</div>}</div>
      <label className="flex items-center gap-3 text-sm text-slate-300 sm:col-span-2"><input type="checkbox" name="isPublished" checked={editing.isPublished} onChange={setField} className="h-4 w-4 accent-blue-500" />Publish on the public portfolio</label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" className="button-secondary" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save project"}</button></div></form>}</GlassModal></div>;
}
