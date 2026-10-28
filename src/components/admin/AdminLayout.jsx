import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, BarChart3, ClipboardList, LogOut, MessageSquare, Settings, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const items = [
  { to: "/admin/dashboard", label: "Overview", icon: BarChart3 },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/leads", label: "Quote inbox", icon: ClipboardList },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/collaborators", label: "Collaborators", icon: Users },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const leave = async () => { await logout(); navigate("/admin/login"); };
  return (
    <div className="min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between lg:block"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><ShieldCheck size={20} /></span><div><p className="font-semibold">Isometric</p><p className="text-xs text-slate-500">Admin workspace</p></div></div><button className="icon-button lg:hidden" aria-label="Sign out" onClick={leave}><LogOut size={17} /></button></div>
        <nav className="mt-6 flex gap-2 overflow-x-auto lg:grid" aria-label="Admin navigation">{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition " + (isActive ? "bg-blue-500/15 text-blue-200" : "text-slate-400 hover:bg-white/5 hover:text-white")}><Icon size={17} />{label}</NavLink>)}</nav>
        <div className="mt-8 hidden border-t border-white/10 pt-5 lg:block"><p className="truncate text-xs text-slate-500">{user?.email}</p><button onClick={leave} className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"><LogOut size={16} /> Sign out</button><a href="/" className="mt-5 flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={15} /> Public site</a></div>
      </aside>
      <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-10"><Outlet /></main>
    </div>
  );
}
