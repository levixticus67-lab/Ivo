import { useId, useRef, useState } from "react";
import { LoaderCircle, Trash2, Upload } from "lucide-react";
import { uploadVideo } from "../../services/api";
import { resolveImageUrl } from "../../utils/images";

const acceptedTypes = ["video/mp4", "video/webm"];
const maxBytes = 25 * 1024 * 1024;

export default function VideoUploadField({ label, value, onChange, helper }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const videoUrl = resolveImageUrl(value);

  const chooseVideo = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!acceptedTypes.includes(file.type)) {
      setError("Choose an MP4 or WebM video.");
      return;
    }
    if (file.size > maxBytes) {
      setError("Videos must be 25 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadVideo(file));
    } catch (reason) {
      setError(reason.message || "Could not upload this video.");
    } finally {
      setUploading(false);
    }
  };

  return <div className="min-w-0">
    <label className="field-label" htmlFor={inputId}>{label}</label>
    {videoUrl && <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
      <video src={videoUrl} controls muted playsInline preload="metadata" className="max-h-56 w-full bg-black" aria-label={label + " preview"} />
      <div className="flex items-center justify-between gap-3 px-3 py-2"><span className="truncate text-xs text-slate-400">Ready to save with site settings</span><button type="button" className="inline-flex shrink-0 items-center gap-1 text-xs text-rose-200 hover:text-white" onClick={() => onChange(null)}><Trash2 size={13} />Remove</button></div>
    </div>}
    <input ref={inputRef} id={inputId} className="sr-only" type="file" accept="video/mp4,video/webm" onChange={chooseVideo} />
    <button type="button" className="button-secondary" disabled={uploading} onClick={() => inputRef.current && inputRef.current.click()}>
      {uploading ? <LoaderCircle className="animate-spin" size={16} /> : <Upload size={16} />}
      {uploading ? "Uploading video…" : videoUrl ? "Replace video" : "Upload video"}
    </button>
    {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    {error && <p role="alert" className="mt-2 text-xs text-rose-200">{error}</p>}
  </div>;
}
