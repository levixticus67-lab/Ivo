import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import GlassCard from "../../components/common/GlassCard";
import LoadingState from "../../components/common/LoadingState";
import { useCollection } from "../../hooks/useCollection";
import { subscribeQuotes, updateQuoteStatus } from "../../services/firestore";
import { formatDate } from "../../utils/format";

const statuses = ["New", "In Review", "Contacted", "Closed"];
export default function Leads() {
  const { items, loading, error } = useCollection(subscribeQuotes);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => items.filter((item) => [item.name, item.email, item.phone, item.projectType, item.location].join(" ").toLowerCase().includes(search.toLowerCase())), [items, search]);
  const update = async (id, status) => {
    setSavingId(id); setNotice("");
    try { await updateQuoteStatus(id, status); } catch (reason) { setNotice(reason.message || "Could not update the inquiry."); }
    finally { setSavingId(""); }
  };

  return <div className="mx-auto max-w-7xl"><div><p className="eyebrow">Inbox</p><h1 className="mt-2 text-3xl font-semibold">Quote requests</h1><p className="mt-2 text-sm text-slate-400">Review incoming project briefs and track follow-up status.</p></div>{notice && <p role="status" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{notice}</p>}<GlassCard className="mt-7 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:px-6"><div><p className="font-medium">Inquiry inbox</p><p className="mt-1 text-xs text-slate-500">{items.length} total requests</p></div><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input className="field-control w-60 pl-9" placeholder="Search inquiries" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>{loading ? <LoadingState label="Loading inquiries" /> : error ? <p className="p-6 text-sm text-rose-200">{error}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Contact</th><th className="px-4 py-4">Project</th><th className="px-4 py-4">Budget / Timeline</th><th className="px-4 py-4">Received</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-white/5">{filtered.map((lead) => <tr key={lead.id} className="align-top hover:bg-white/[.025]"><td className="px-6 py-4"><p className="font-medium text-slate-200">{lead.name}</p><a href={"mailto:" + lead.email} className="mt-1 block text-xs text-blue-200">{lead.email}</a>{lead.phone && <a href={"tel:" + lead.phone} className="mt-1 block text-xs text-slate-500">{lead.phone}</a>}{lead.company && <p className="mt-1 text-xs text-slate-500">{lead.company}</p>}</td><td className="max-w-xs px-4 py-4"><p className="font-medium text-slate-300">{lead.projectType}</p><p className="mt-1 text-xs text-slate-500">{lead.location}</p><p className="mt-2 whitespace-normal text-xs leading-5 text-slate-400">{lead.description}</p></td><td className="px-4 py-4 text-xs text-slate-400"><p>{lead.budget || "Budget not shared"}</p><p className="mt-2">{lead.timeline || "Timeline not shared"}</p></td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{formatDate(lead.createdAt)}</td><td className="px-6 py-4"><select className="field-control min-w-32 py-2 text-xs" value={lead.status || "New"} disabled={savingId === lead.id} onChange={(event) => update(lead.id, event.target.value)} aria-label={"Status for " + lead.name}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table>{!filtered.length && <p className="p-8 text-center text-sm text-slate-500">No matching inquiries.</p>}</div>}</GlassCard></div>;
}
