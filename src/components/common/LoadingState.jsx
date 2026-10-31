export default function LoadingState({ label = "Loading" }) {
  return <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-sm text-slate-300"><img src="/favicon.svg" alt="" aria-hidden="true" className="h-6 w-6 animate-pulse" />{label}</div>;
}
