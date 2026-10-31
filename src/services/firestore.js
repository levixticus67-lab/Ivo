import {
  addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp,
  setDoc, updateDoc, where,
} from "firebase/firestore";
import { db } from "../firebase/config";

function sortNewestFirst(items) {
  return items.sort((a, b) => {
    const left = a.createdAt && typeof a.createdAt.toMillis === "function" ? a.createdAt.toMillis() : 0;
    const right = b.createdAt && typeof b.createdAt.toMillis === "function" ? b.createdAt.toMillis() : 0;
    return right - left;
  });
}

function watchCollection(name, callback, onError, publicOnly = false) {
  if (!db) { callback([]); return () => {}; }
  const source = publicOnly ? query(collection(db, name), where("isPublished", "==", true)) : collection(db, name);
  return onSnapshot(source, (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    callback(sortNewestFirst(items));
  }, onError);
}

export function subscribePublicProjects(callback, onError) {
  return watchCollection("projects", (items) => callback(items.filter((item) => !item.isDemo)), onError, true);
}
export function subscribeAdminProjects(callback, onError) {
  return watchCollection("projects", callback, onError);
}
export function subscribeTestimonials(callback, onError) {
  return watchCollection("testimonials", callback, onError, true);
}
export function subscribeAdminTestimonials(callback, onError) {
  return watchCollection("testimonials", callback, onError);
}
export function createTestimonial(values) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "testimonials"), { ...values, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export function updateTestimonial(id, values) {
  if (!db) throw new Error("Firebase is not configured.");
  return updateDoc(doc(db, "testimonials", id), { ...values, updatedAt: serverTimestamp() });
}
export function removeTestimonial(id) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, "testimonials", id));
}
export function subscribeQuotes(callback, onError) {
  return watchCollection("quotes", callback, onError);
}
export function subscribeSiteSettings(callback, onError) {
  if (!db) { callback({}); return () => {}; }
  return onSnapshot(doc(db, "siteSettings", "public"), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : {});
  }, onError);
}
export function createQuote(values) {
  if (!db) throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* values before accepting quote requests.");
  return addDoc(collection(db, "quotes"), { ...values, status: "New", createdAt: serverTimestamp() });
}
export function createProject(values) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "projects"), { ...values, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export function updateProject(id, values) {
  if (!db) throw new Error("Firebase is not configured.");
  return updateDoc(doc(db, "projects", id), { ...values, updatedAt: serverTimestamp() });
}
export function removeProject(id) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, "projects", id));
}
export function updateQuoteStatus(id, status) {
  if (!db) throw new Error("Firebase is not configured.");
  return updateDoc(doc(db, "quotes", id), { status, updatedAt: serverTimestamp() });
}
export function saveSiteSettings(values) {
  if (!db) throw new Error("Firebase is not configured.");
  return setDoc(doc(db, "siteSettings", "public"), { ...values, updatedAt: serverTimestamp() }, { merge: true });
}
