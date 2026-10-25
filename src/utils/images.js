export function resolveImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secureUrl || image.secure_url || "";
}
