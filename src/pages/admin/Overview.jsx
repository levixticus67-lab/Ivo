import { useMemo } from "react";
import { Activity, Briefcase, ClipboardList, Clock, FileText } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "../../components/common/GlassCard";
import LoadingState from "../../components/common/LoadingState";
import StatCard from "../../components/admin/StatCard";
import { useCollection } from "../../hooks/useCollection";
import { subscribeAdminProjects, subscribeQuotes } from "../../services/firestore";
import { formatDate } from "../../utils/format";

function buildActivity(quotes) {
  const months = [];
  const now = new Date();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    months.push({ key: date.getFullYear() + "-" + date.getMonth(), month: new Intl.DateTimeFormat("en", { month: "short" }).format(date), inquiries: 0, year: date.getFullYear(), monthIndex: date.getMonth() });
  }
  quotes.forEach((quote) => {
    const date = quote.createdAt && typeof quote.createdAt.toDate === "function" ? quote.createdAt.toDate() : quote.createdAt ? new Date(quote.createdAt) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const target = months.find((item) => item.year === date.getFullYear() && item.monthIndex === date.getMonth());
    if (target) target.inquiries += 1;
  });
  return months;
}

export default function Overview() {
  const projects = useCollection(subscribeAdminProjects);
  const quotes = useCollection(subscribeQuotes);
  const active = projects.items.filter((item) => (item.status || "").toLowerCase() === "ongoing").length;
  const completed = projects.items.filter((item) => (item.status || "").toLowerCase() === "completed").length;
  const pending = quotes.items.filter((item) => ["new", "in review"].includes((item.status || "").toLowerCase())).length;
  const activity = useMemo(() => buildActivity(quotes.items), [quotes.items]);
  if (projects.loading || quotes.loading) return <LoadingState label="Loading dashboard metrics" />;

  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Admin workspace</p><h1 className="mt-2 text-3xl font-semibold">Overview</h1><p className="mt-2 text-sm text-slate-400">A live snapshot of the portfolio and incoming enquiries.</p></div><p className="text-xs text-slate-500"><Activity className="mr-1 inline text-blue-300" size={14} />Live data</p></div>{(projects.error || quotes.error) && <p className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">Some metrics could not load: {projects.error || quotes.error}</p>}<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total inquiries" value={quotes.items.length} icon={ClipboardList} helper="All quote requests" /><StatCard label="Active projects" value={active} icon={Briefcase} tone="cyan" helper="Marked ongoing" /><StatCard label="Completed projects" value={completed} icon={FileText} tone="violet" helper="Marked completed" /><StatCard label="Pending quotes" value={pending} icon={Clock} helper="New or in review" /></div><div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><GlassCard className="p-5 sm:p-6"><div className="mb-6"><p className="text-sm font-semibold">Inquiry activity</p><p className="mt-1 text-xs text-slate-500">Quote requests created in the last six months</p></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="inquiryFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#60a5fa" stopOpacity={0.34} /><stop offset="95%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} /><XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff" }} /><Area type="monotone" dataKey="inquiries" stroke="#60a5fa" strokeWidth={2} fill="url(#inquiryFill)" /></AreaChart></ResponsiveContainer></div></GlassCard><GlassCard className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Latest inquiries</p><p className="mt-1 text-xs text-slate-500">Most recent quote requests</p></div><ClipboardList className="text-blue-300" size={18} /></div><div className="mt-5 space-y-4">{quotes.items.slice(0, 5).map((quote) => <div key={quote.id} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-200">{quote.name}</p><p className="mt-1 truncate text-xs text-slate-500">{quote.projectType}</p></div><div className="shrink-0 text-right"><span className="status-pill status-new">{quote.status}</span><p className="mt-1 text-[10px] text-slate-600">{formatDate(quote.createdAt)}</p></div></div>)}{!quotes.items.length && <p className="py-8 text-center text-sm text-slate-500">No quote requests yet.</p>}</div></GlassCard></div></div>;
}
