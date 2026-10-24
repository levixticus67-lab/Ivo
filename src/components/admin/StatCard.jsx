import GlassCard from "../common/GlassCard";

export default function StatCard({ label, value, icon: Icon, tone = "blue", helper }) {
  return <GlassCard className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold text-white">{value}</p>{helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}</div><span className={"grid h-11 w-11 place-items-center rounded-xl " + (tone === "cyan" ? "bg-cyan-400/10 text-cyan-300" : tone === "violet" ? "bg-violet-400/10 text-violet-300" : "bg-blue-400/10 text-blue-300")}><Icon size={20} /></span></div></GlassCard>;
}
