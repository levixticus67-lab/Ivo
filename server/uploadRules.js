export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
export const ALLOWED_VIDEO_TYPES = Object.freeze([
  "video/mp4",
  "video/webm",
]);

const uploadFolders = Object.freeze({
  hero: "isometric-designs/website/hero",
  "hero-video": "isometric-designs/website/hero-video",
  about: "isometric-designs/website/about",
  contact: "isometric-designs/website/contact",
  service: "isometric-designs/website/services",
  "project-cover": "isometric-designs/website/projects/covers",
  "project-gallery": "isometric-designs/website/projects/gallery",
  testimonial: "isometric-designs/website/testimonials",
  collaborator: "isometric-designs/website/collaborators",
});

export function getUploadFolder(section) {
  if (typeof section !== "string" || !Object.hasOwn(uploadFolders, section)) {
    throw new Error("Choose a supported media area before uploading.");
  }
  return uploadFolders[section];
}

export function isAllowedImageType(mimeType) {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isAllowedVideoType(mimeType) {
  return ALLOWED_VIDEO_TYPES.includes(mimeType);
}
