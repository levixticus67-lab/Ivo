import test from "node:test";
import assert from "node:assert/strict";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, getUploadFolder, isAllowedImageType } from "./uploadRules.js";

test("upload scopes resolve only to fixed Isometric folders", () => {
  assert.equal(getUploadFolder("hero"), "isometric-designs/website/hero");
  assert.equal(getUploadFolder("project-gallery"), "isometric-designs/website/projects/gallery");
  assert.equal(getUploadFolder("collaborator"), "isometric-designs/website/collaborators");
  assert.throws(() => getUploadFolder("../../private"), /supported image area/);
  assert.throws(() => getUploadFolder(""), /supported image area/);
});

test("image uploads allow only supported raster formats and cap files at 10 MB", () => {
  assert.deepEqual(ALLOWED_IMAGE_TYPES, ["image/jpeg", "image/png", "image/webp", "image/avif"]);
  assert.equal(MAX_IMAGE_BYTES, 10 * 1024 * 1024);
  assert.equal(isAllowedImageType("image/jpeg"), true);
  assert.equal(isAllowedImageType("image/svg+xml"), false);
  assert.equal(isAllowedImageType("application/javascript"), false);
});
