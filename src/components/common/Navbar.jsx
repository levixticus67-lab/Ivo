import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Building2, Menu, X } from "lucide-react";

const links = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="glass-panel mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main navigation">
        <Link to="/" onClick={close} className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-blue-300/20 bg-blue-500/15 text-blue-300"><Building2 size={21} /></span>
          <span className="min-w-0"><span className="block truncate text-sm font-semibold tracking-wide text-white sm:text-base">Isometric Designs</span><span className="hidden text-[10px] uppercase tracking-[.18em] text-slate-400 sm:block">Company Limited</span></span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => "text-sm transition " + (isActive ? "text-white" : "text-slate-300 hover:text-white")}>{link.label}</NavLink>)}
          <Link to="/contact" className="button-primary px-4 py-2 text-sm">Request a quote <ArrowUpRight size={15} /></Link>
        </div>
        <button type="button" className="icon-button md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
      {open && <div className="glass-panel mx-auto mt-2 max-w-7xl p-3 md:hidden">{links.map((link) => <NavLink onClick={close} key={link.to} to={link.to} className="block rounded-xl px-4 py-3 text-sm text-slate-200 hover:bg-white/10">{link.label}</NavLink>)}<Link onClick={close} to="/contact" className="button-primary mt-2 w-full">Request a quote <ArrowUpRight size={15} /></Link></div>}
    </header>
  );
}
