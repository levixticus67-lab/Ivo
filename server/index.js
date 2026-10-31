import "dotenv/config";
import { Readable } from "node:stream";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import multer from "multer";
import { getUploadFolder, isAllowedImageType, isAllowedVideoType, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "./uploadRules.js";

const app = express();
const port = Number(process.env.PORT) || 10000;
const allowedOrigins = new Set(
  (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const firebaseReady = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
const cloudinaryReady = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
let firebaseAuth;

app.disable("x-powered-by");
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed."));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  maxAge: 600,
}));
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, firebaseAdminConfigured: firebaseReady, cloudinaryConfigured: cloudinaryReady });
});

function getFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;
  if (!firebaseReady) throw new Error("Firebase Admin credentials are not configured on the API service.");
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }, "isometric-designs-api");
  firebaseAuth = getAuth(adminApp);
  return firebaseAuth;
}

async function requireAdmin(request, response, next) {
  const header = request.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return response.status(401).json({ error: "Sign in with an approved admin account to upload images." });
  let adminAuth;
  try {
    adminAuth = getFirebaseAuth();
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error && error.message ? error.message : "unknown error");
    return response.status(503).json({ error: "Firebase Admin credentials are missing or invalid on the API service." });
  }
  try {
    const claims = await adminAuth.verifyIdToken(token);
    if (claims.admin !== true) return response.status(403).json({ error: "This account does not have administrator upload access." });
    request.adminUid = claims.uid;
    return next();
  } catch (_error) {
    return response.status(401).json({ error: "Your admin session could not be verified. Sign in again and retry." });
  }
}

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 2, parts: 3 },
  fileFilter(_request, file, callback) {
    if (!isAllowedImageType(file.mimetype)) return callback(new Error("Upload a JPG, PNG, WebP, or AVIF image."));
    return callback(null, true);
  },
}).single("image");

const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_BYTES, files: 1, fields: 0, parts: 1 },
  fileFilter(_request, file, callback) {
    if (!isAllowedVideoType(file.mimetype)) return callback(new Error("Upload an MP4 or WebM video."));
    return callback(null, true);
  },
}).single("video");

function uploadImage(file, folder) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
      use_filename: true,
      unique_filename: true,
    }, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
    Readable.from(file.buffer).pipe(uploadStream);
  });
}

function uploadVideo(file, folder) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: "video",
      allowed_formats: ["mp4", "webm"],
      use_filename: true,
      unique_filename: true,
    }, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
    Readable.from(file.buffer).pipe(uploadStream);
  });
}

app.post("/api/uploads", requireAdmin, (request, response, next) => {
  imageUpload(request, response, (error) => error ? next(error) : next());
}, async (request, response, next) => {
  try {
    if (!cloudinaryReady) return response.status(503).json({ error: "Cloudinary is not configured on the API service yet." });
    if (!request.file) return response.status(400).json({ error: "Choose an image file to upload." });
    if (!isAllowedImageType(request.file.mimetype)) return response.status(415).json({ error: "Upload a JPG, PNG, WebP, or AVIF image." });
    let folder;
    try {
      folder = getUploadFolder(request.body.section);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
    const result = await uploadImage(request.file, folder);
    return response.status(201).json({ asset: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    } });
  } catch (error) {
    console.error("Cloudinary image upload failed:", error && error.message ? error.message : "unknown error");
    return next(new Error("Cloudinary could not save this image. Check the API service configuration and try again."));
  }
});

app.post("/api/uploads/videos", requireAdmin, (request, response, next) => {
  videoUpload(request, response, (error) => error ? next(error) : next());
}, async (request, response, next) => {
  try {
    if (!cloudinaryReady) return response.status(503).json({ error: "Cloudinary is not configured on the API service yet." });
    if (!request.file) return response.status(400).json({ error: "Choose an MP4 or WebM video to upload." });
    if (!isAllowedVideoType(request.file.mimetype)) return response.status(415).json({ error: "Upload an MP4 or WebM video." });
    const result = await uploadVideo(request.file, getUploadFolder("hero-video"));
    return response.status(201).json({ asset: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration,
    } });
  } catch (error) {
    console.error("Cloudinary hero video upload failed:", error && error.message ? error.message : "unknown error");
    return next(new Error("Cloudinary could not save this video. Check the API service configuration and try again."));
  }
});

app.use((error, request, response, _next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? (request.path === "/api/uploads/videos" ? "Videos must be 25 MB or smaller." : "Image must be 10 MB or smaller.") : "Upload one file at a time.";
    return response.status(400).json({ error: message });
  }
  if (error && error.message === "Origin is not allowed.") return response.status(403).json({ error: "This website origin is not allowed to upload here." });
  if (error && (error.message === "Upload a JPG, PNG, WebP, or AVIF image." || error.message === "Upload an MP4 or WebM video.")) return response.status(415).json({ error: error.message });
  const status = Number(error && error.status) || 500;
  return response.status(status).json({ error: error && error.message ? error.message : "The upload request failed." });
});

app.listen(port, "0.0.0.0", () => {
  console.log("Isometric image API listening on port " + port);
});
