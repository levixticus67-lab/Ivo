import { useId, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { uploadImage } from "../../services/api";
import { resolveImageUrl } from "../../utils/images";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxBytes = 10 * 1024 * 1024;

export default function ImageUploadField({ label, scope, value, onChange, helper, compact = false }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const imageUrl = resolveImageUrl(value);

  const chooseImage = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!acceptedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, WebP, or AVIF image.");
      return;
    }
    if (file.size > maxBytes) {
      setError("Images must be 10 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadImage(file, scope);
      onChange(asset);
    } catch (reason) {
      setError(reason.message || "Could not upload this image.");
    } finally {
      setUploading(false);
    }
  };

  return <div className="min-w-0">
    <label className="field-label" htmlFor={inputId}>{label}</label>
    {imageUrl && <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
      <img src={imageUrl} alt={label + " preview"} className={compact ? "h-32 w-full object-cover" : "h-44 w-full object-cover"} />
      <div className="flex items-center justify-between gap-3 px-3 py-2"><span className="truncate text-xs text-slate-400">Ready to save with this record</span><button type="button" className="inline-flex shrink-0 items-center gap-1 text-xs text-rose-200 hover:text-white" onClick={() => onChange(null)}><Trash2 size={13} />Remove</button></div>
    </div>}
    <input ref={inputRef} id={inputId} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={chooseImage} />
    <button type="button" className="button-secondary" disabled={uploading} onClick={() => inputRef.current && inputRef.current.click()}>
      {uploading ? <LoaderCircle className="animate-spin" size={16} /> : <ImagePlus size={16} />}
      {uploading ? "Uploading image…" : imageUrl ? "Replace image" : "Upload image"}
    </button>
    {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    {error && <p role="alert" className="mt-2 text-xs text-rose-200">{error}</p>}
  </div>;
}
