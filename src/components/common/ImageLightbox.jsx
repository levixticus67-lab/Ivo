import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImageLightbox({ image, onClose }) {
  const src = image && image.src;
  const alt = image && image.alt ? image.alt : "Full-size image";

  useEffect(() => {
    if (!src) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-3 sm:p-6" onClick={onClose}>
      <button type="button" className="icon-button fixed right-4 top-4 z-10" aria-label="Close full-size image" onClick={(event) => { event.stopPropagation(); onClose(); }}><X size={20} /></button>
      <img src={src} alt={alt} className="max-h-[92vh] max-w-full cursor-zoom-out object-contain" onClick={(event) => event.stopPropagation()} />
    </div>
  );
}
