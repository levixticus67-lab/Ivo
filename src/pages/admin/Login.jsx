import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft, Building2, LockKeyhole } from "lucide-react";
import { auth, isFirebaseConfigured } from "../../firebase/config";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!auth) { setError("Firebase is not configured for this deployment."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (_reason) {
      setError("Sign-in failed. Check your credentials and make sure this account is enabled in Firebase Authentication.");
    } finally { setLoading(false); }
  };

  return <div className="bg-mesh flex min-h-screen items-center justify-center px-4 py-12 text-white"><div className="w-full max-w-md"><Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={15} /> Back to public site</Link><div className="glass-panel p-7 sm:p-9"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-300"><Building2 size={22} /></span><p className="eyebrow mt-6">Staff access</p><h1 className="mt-2 text-3xl font-semibold">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-slate-400">Use an account provisioned by the company administrator.</p>{!isFirebaseConfigured && <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">Firebase setup is required before admin sign-in is available.</p>}<form onSubmit={submit} className="mt-7 space-y-5"><div><label className="field-label" htmlFor="email">Work email</label><input className="field-control" id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div><label className="field-label" htmlFor="password">Password</label><input className="field-control" id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>{error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{error}</p>}<button className="button-primary w-full" type="submit" disabled={loading || !isFirebaseConfigured}><LockKeyhole size={16} />{loading ? "Signing in…" : "Sign in securely"}</button></form><p className="mt-6 text-xs leading-5 text-slate-500">Admin pages require a server-assigned Firebase admin claim. A successful password sign-in alone does not grant dashboard access.</p></div></div></div>;
}
