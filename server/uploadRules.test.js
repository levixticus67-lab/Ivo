import test from "node:test";
import assert from "node:assert/strict";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, getUploadFolder, isAllowedImageType, isAllowedVideoType } from "./uploadRules.js";

test("upload scopes resolve only to fixed Isometric folders", () => {
  assert.equal(getUploadFolder("hero"), "isometric-designs/website/hero");
  assert.equal(getUploadFolder("hero-video"), "isometric-designs/website/hero-video");
  assert.equal(getUploadFolder("project-gallery"), "isometric-designs/website/projects/gallery");
  assert.equal(getUploadFolder("collaborator"), "isometric-designs/website/collaborators");
  assert.throws(() => getUploadFolder("../../private"), /supported media area/);
  assert.throws(() => getUploadFolder(""), /supported media area/);
});

test("image uploads allow only supported raster formats and cap files at 10 MB", () => {
  assert.deepEqual(ALLOWED_IMAGE_TYPES, ["image/jpeg", "image/png", "image/webp", "image/avif"]);
  assert.equal(MAX_IMAGE_BYTES, 10 * 1024 * 1024);
  assert.equal(isAllowedImageType("image/jpeg"), true);
  assert.equal(isAllowedImageType("image/svg+xml"), false);
  assert.equal(isAllowedImageType("application/javascript"), false);
});

test("hero videos allow only MP4 and WebM files up to 25 MB", () => {
  assert.deepEqual(ALLOWED_VIDEO_TYPES, ["video/mp4", "video/webm"]);
  assert.equal(MAX_VIDEO_BYTES, 25 * 1024 * 1024);
  assert.equal(isAllowedVideoType("video/mp4"), true);
  assert.equal(isAllowedVideoType("video/webm"), true);
  assert.equal(isAllowedVideoType("video/quicktime"), false);
  assert.equal(isAllowedVideoType("application/javascript"), false);
});
