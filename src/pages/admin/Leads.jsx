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
  const filtered = useMemo(() => items.filter((item) => [item.name, item.email, item.phone, item.company, item.projectType, item.location, item.description].join(" ").toLowerCase().includes(search.toLowerCase())), [items, search]);
  const update = async (id, status) => {
    setSavingId(id); setNotice("");
    try { await updateQuoteStatus(id, status); } catch (reason) { setNotice(reason.message || "Could not update the inquiry."); }
    finally { setSavingId(""); }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div><p className="eyebrow">Inbox</p><h1 className="mt-2 text-3xl font-semibold">Quote requests</h1><p className="mt-2 text-sm text-slate-400">Review incoming project briefs and track follow-up status.</p></div>
      {notice && <p role="status" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{notice}</p>}
      <GlassCard className="mt-7 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><p className="font-medium">Inquiry inbox</p><p className="mt-1 text-xs text-slate-500">{items.length} total requests</p></div>
          <label className="relative block w-full sm:w-60"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} /><input className="field-control w-full pl-9" placeholder="Search inquiries" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        {loading ? <LoadingState label="Loading inquiries" /> : error ? <p className="p-6 text-sm text-rose-200">{error}</p> : filtered.length ? (
          <div className="divide-y divide-white/5">
            {filtered.map((lead) => (
              <article key={lead.id} className="p-4 transition hover:bg-white/[.025] sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</p>
                      <p className="mt-2 break-words font-medium text-slate-200">{lead.name}</p>
                      <a href={"mailto:" + lead.email} className="mt-1 block break-all text-xs text-blue-200">{lead.email}</a>
                      {lead.phone && <a href={"tel:" + lead.phone} className="mt-1 block text-xs text-slate-400">{lead.phone}</a>}
                      {lead.company && <p className="mt-1 break-words text-xs text-slate-400">{lead.company}</p>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project</p>
                      <p className="mt-2 break-words font-medium text-slate-200">{lead.projectType}</p>
                      {lead.location && <p className="mt-1 break-words text-xs text-slate-400">{lead.location}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:col-span-2 xl:col-span-1">
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Budget</p><p className="mt-2 break-words text-sm text-slate-300">{lead.budget || "Not provided"}</p></div>
                      <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline</p><p className="mt-2 break-words text-sm text-slate-300">{lead.timeline || "Not provided"}</p></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 lg:min-w-[190px] lg:flex-col lg:items-end lg:justify-start">
                    <time className="text-xs text-slate-500">{formatDate(lead.createdAt)}</time>
                    <select className="field-control w-full py-2 text-xs sm:w-40" value={lead.status || "New"} disabled={savingId === lead.id} onChange={(event) => update(lead.id, event.target.value)} aria-label={"Status for " + lead.name}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/25 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project description</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{lead.description || "No description provided."}</p>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="p-8 text-center text-sm text-slate-500">No matching inquiries.</p>}
      </GlassCard>
    </div>
  );
}
