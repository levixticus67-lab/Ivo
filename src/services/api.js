import { auth } from "../firebase/config";

function normalizeApiBase(value) {
  let base = (value || "").trim().replace(/\/+$/, "");
  if (!base) return "";
  if (!/^https?:\/\//i.test(base)) base = "https://" + base;
  return /\/api$/i.test(base) ? base : base + "/api";
}

const quoteApiBase = normalizeApiBase(import.meta.env.VITE_RENDER_API_URL);
const uploadApiBase = normalizeApiBase(import.meta.env.VITE_UPLOAD_API_URL);

async function requestJson(baseUrl, path, body) {
  if (!baseUrl) return { skipped: true };
  const response = await fetch(baseUrl + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Backend request failed with status " + response.status);
  }
  return response.status === 204 ? null : response.json().catch(() => null);
}

export function submitQuoteToApi(quote) {
  return requestJson(quoteApiBase, "/quotes", quote);
}

export async function uploadImage(file, section) {
  if (!uploadApiBase) throw new Error("Image uploads are not connected. Add VITE_UPLOAD_API_URL after deploying the Render API service.");
  if (!auth || !auth.currentUser) throw new Error("Sign in with an approved admin account before uploading images.");
  const token = await auth.currentUser.getIdToken();
  const body = new FormData();
  body.append("image", file);
  body.append("section", section);
  const response = await fetch(uploadApiBase + "/uploads", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Image upload failed with status " + response.status);
  if (!payload.asset || !payload.asset.url) throw new Error("The image server returned an incomplete upload result.");
  return payload.asset;
}

export async function uploadVideo(file) {
  if (!uploadApiBase) throw new Error("Video uploads are not connected. Add VITE_UPLOAD_API_URL after deploying the Render API service.");
  if (!auth || !auth.currentUser) throw new Error("Sign in with an approved admin account before uploading videos.");
  const token = await auth.currentUser.getIdToken();
  const body = new FormData();
  body.append("video", file);
  const response = await fetch(uploadApiBase + "/uploads/videos", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Video upload failed with status " + response.status);
  if (!payload.asset || !payload.asset.url) throw new Error("The video server returned an incomplete upload result.");
  return payload.asset;
}
