import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { subscribeSiteSettings } from "../../services/firestore";

const watchFooterSettings = (callback, onError) => subscribeSiteSettings((settings) => callback([settings]), onError);

const socialPlatforms = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "youtube", label: "YouTube", Icon: Youtube },
];

function safeSocialUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

export default function Footer() {
  const { items: settingsItems } = useCollection(watchFooterSettings);
  const settings = settingsItems[0] || {};
  const socialLinks = socialPlatforms.map((platform) => ({
    ...platform,
    href: safeSocialUrl(settings.socialLinks && settings.socialLinks[platform.key]),
  })).filter((platform) => platform.href);
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div><Link to="/" className="inline-block max-w-sm font-bold uppercase leading-snug tracking-[.1em] text-white">Isometric Designs and Construction Company Limited</Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Construction, engineering and design, working together from start to finish.</p>{socialLinks.length > 0 && <nav className="mt-5 flex flex-wrap gap-2" aria-label="Social media">{socialLinks.map(({ key, label, Icon, href }) => <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label} className="icon-button"><Icon size={17} aria-hidden="true" /></a>)}</nav>}</div>
        <div><p className="text-sm font-semibold text-white">Explore</p><div className="mt-4 grid gap-3 text-sm text-slate-400"><Link to="/about" className="hover:text-white">About</Link><Link to="/services" className="hover:text-white">Services</Link><Link to="/projects" className="hover:text-white">Projects</Link><Link to="/contact" className="hover:text-white">Contact</Link></div></div>
        <div><p className="text-sm font-semibold text-white">Contact</p><div className="mt-4 grid gap-3 text-sm text-slate-400">{settings.address && <p className="flex gap-2"><MapPin size={16} className="shrink-0 text-blue-300" />{settings.address}</p>}{settings.phone && <a className="flex gap-2 hover:text-white" href={"tel:" + settings.phone}><Phone size={16} className="text-blue-300" />{settings.phone}</a>}{settings.email && <a className="flex gap-2 hover:text-white" href={"mailto:" + settings.email}><Mail size={16} className="text-blue-300" />{settings.email}</a>}{!settings.address && !settings.phone && !settings.email && <span>Contact details will appear here once confirmed.</span>}{settings.workingHours && <p>{settings.workingHours}</p>}</div></div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} Isometric Designs and Construction Company Limited</span><Link to="/admin/login" className="hover:text-slate-300">Staff sign in</Link></div>
    </footer>
  );
}
