import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur-xl sm:px-6">
      <nav className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between gap-6 py-3" aria-label="Main navigation">
        <Link to="/" onClick={close} className="flex min-w-0 items-center gap-3 leading-tight">
          <img src="/favicon.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" />
          <span className="block truncate text-[10px] font-bold uppercase tracking-[.08em] text-white sm:text-sm">Isometric Designs and Construction</span>
          <span className="mt-1 block text-[9px] uppercase tracking-[.18em] text-slate-400 sm:text-[10px]">Company Limited</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => "relative py-2 text-sm transition " + (isActive ? "font-semibold text-white after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-amber-300" : "text-slate-300 hover:text-white")}>{link.label}</NavLink>)}
          <Link to="/contact" className="button-primary px-4 py-2 text-sm">Request a quote</Link>
        </div>
        <button type="button" className="icon-button md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
      {open && <div className="mx-auto max-w-7xl border-t border-white/10 py-3 md:hidden">{links.map((link) => <NavLink onClick={close} key={link.to} to={link.to} end={link.end} className={({ isActive }) => "block border-l-2 px-4 py-3 text-sm transition " + (isActive ? "border-amber-300 text-white" : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white")}>{link.label}</NavLink>)}<Link onClick={close} to="/contact" className="button-primary mt-2 w-full">Request a quote</Link></div>}
    </header>
  );
}
