import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading" }) {
  return <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-300"><Loader2 className="animate-spin text-blue-400" size={20} />{label}</div>;
}
