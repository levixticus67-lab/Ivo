export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const uploadFolders = Object.freeze({
  hero: "isometric-designs/website/hero",
  about: "isometric-designs/website/about",
  contact: "isometric-designs/website/contact",
  service: "isometric-designs/website/services",
  "project-cover": "isometric-designs/website/projects/covers",
  "project-gallery": "isometric-designs/website/projects/gallery",
  testimonial: "isometric-designs/website/testimonials",
});

export function getUploadFolder(section) {
  if (typeof section !== "string" || !Object.hasOwn(uploadFolders, section)) {
    throw new Error("Choose a supported image area before uploading.");
  }
  return uploadFolders[section];
}

export function isAllowedImageType(mimeType) {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}
