import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isFirebaseConfigured } from "../../firebase/config";
import LoadingState from "../common/LoadingState";

export default function ProtectedRoute() {
  const { user, isAdmin, loading, logout } = useAuth();
  if (loading) return <LoadingState label="Checking administrator access" />;
  if (!isFirebaseConfigured) return <div className="mx-auto max-w-lg px-5 py-24 text-center"><h1 className="text-2xl font-semibold">Firebase is not configured</h1><p className="mt-3 text-slate-400">Add the Firebase environment variables to enable admin access.</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <div className="mx-auto max-w-lg px-5 py-24 text-center"><h1 className="text-2xl font-semibold">Administrator access required</h1><p className="mt-3 text-slate-400">This account is signed in but does not have the admin custom claim.</p><button className="button-secondary mt-6" onClick={logout}>Sign out</button></div>;
  return <Outlet />;
}
