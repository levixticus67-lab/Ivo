import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { subscribeSiteSettings } from "../../services/firestore";

const watchFooterSettings = (callback, onError) => subscribeSiteSettings((settings) => callback([settings]), onError);

function TikTokIcon({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.525.02c1.31-.02 2.61-.01 3.92-.02.08 1.53.63 2.99 1.74 4.03 1.1 1.04 2.57 1.58 3.83 1.59v3.92a9.3 9.3 0 0 1-5.58-1.87v8.47c0 1.74-.7 3.4-1.93 4.63a6.5 6.5 0 0 1-4.61 1.9c-1.74.01-3.41-.68-4.64-1.9a6.54 6.54 0 0 1-.91-8.16 6.53 6.53 0 0 1 7.73-2.79v4.2a3.2 3.2 0 0 0-3.74.75 3.22 3.22 0 0 0 .13 4.27 3.2 3.2 0 0 0 4.5.1c.59-.59.91-1.39.91-2.22V0h-.35z" /></svg>;
}

const socialPlatforms = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
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
        <div><Link to="/" className="inline-flex max-w-sm items-center gap-3 font-bold uppercase leading-snug tracking-[.1em] text-white"><img src="/favicon.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" /><span>Isometric Designs and Construction Company Limited</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Construction, engineering and design, working together from start to finish.</p>{socialLinks.length > 0 && <nav className="mt-5 flex flex-wrap gap-2" aria-label="Social media">{socialLinks.map(({ key, label, Icon, href }) => <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} title={label} className="icon-button"><Icon size={17} aria-hidden="true" /></a>)}</nav>}</div>
        <div><p className="text-sm font-semibold text-white">Explore</p><div className="mt-4 grid gap-3 text-sm text-slate-400"><Link to="/about" className="hover:text-white">About</Link><Link to="/services" className="hover:text-white">Services</Link><Link to="/projects" className="hover:text-white">Projects</Link><Link to="/contact" className="hover:text-white">Contact</Link></div></div>
        <div><p className="text-sm font-semibold text-white">Contact</p><div className="mt-4 grid gap-3 text-sm text-slate-400">{settings.address && <p className="flex gap-2"><MapPin size={16} className="shrink-0 text-blue-300" />{settings.address}</p>}{settings.phone && <a className="flex gap-2 hover:text-white" href={"tel:" + settings.phone}><Phone size={16} className="text-blue-300" />{settings.phone}</a>}{settings.email && <a className="flex gap-2 hover:text-white" href={"mailto:" + settings.email}><Mail size={16} className="text-blue-300" />{settings.email}</a>}{settings.workingHours && <p>{settings.workingHours}</p>}</div></div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} Isometric Designs and Construction Company Limited</span><Link to="/admin/login" className="hover:text-slate-300">Staff sign in</Link></div>
    </footer>
  );
}
