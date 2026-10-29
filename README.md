# Isometric Designs and Construction Company Limited

A React, Vite, and Tailwind public website with a Firebase-backed admin dashboard and a signed Cloudinary image upload API.

## Included

- Public routes: home, about, services, projects, and contact / quote request.
- Admin routes: Firebase sign-in, analytics overview, project CRUD, quote inbox, testimonial publishing, and site settings, including social profile URLs.
- Firebase Auth custom-claim authorization and restrictive Firestore rules. Public visitors can create validated quote requests; only administrators can read leads or edit site data.
- Admin image-upload buttons for homepage, About, contact, service cards, project covers and galleries, and testimonial portraits.
- A Node API service that verifies Firebase admin ID tokens before uploading images to Cloudinary. The Cloudinary API secret stays server-side.
- Clearly labelled illustrative sample images and portfolio concepts for visual testing. They are not real company projects or client claims.
- Render Blueprint for the static frontend and API service, GitHub Actions CI, and manual Render deploy workflows.

## Local setup

1. Install Node.js 20 or later.
2. Run npm install for the frontend and npm install inside server for the API.
3. Copy .env.example to .env.local. For the API, copy server/.env.example to server/.env and use test credentials from your own Firebase and Cloudinary accounts.
4. Configure Firebase Authentication, Firestore, the approved admin claim, and the server-side Firebase Admin credentials described in DEPLOYMENT_GUIDE.md.
5. Run npm run dev for the frontend. Run npm start from server for the upload API. Use npm run lint and npm run build for frontend checks; use npm run check and npm test from server for API checks.

Never commit real .env files, Cloudinary API secrets, Firebase service-account private keys, or deploy-hook URLs. Vite environment values are bundled into the public website; only public Firebase web-app configuration belongs there.

## Deploy

Use the step-by-step [deployment guide](DEPLOYMENT_GUIDE.md). The Render Blueprint creates an API web service and a static frontend with a linked upload API URL and SPA rewrite. GitHub Actions lint/build the frontend and run API syntax and unit checks. Configure Render secrets before enabling uploads.

## Data model

- projects: title, category, status, location, imageUrl, imagePublicId, gallery, client, summary, description, isPublished, timestamps.
- quotes: contact details, project brief, status, createdAt.
- testimonials: quote, name, role, optional portrait, isPublished.
- siteSettings/public: verified contact details, social media profile URLs, hero/About/contact imagery, per-service images, tagline, and updatedAt.
- Cloudinary folders: fixed website-image areas; image uploads require a verified Firebase admin custom claim.

The repository contains no sample client records, testimonials, employee identities, project claims, or company certifications. The visual demo assets are marked as illustrative concepts.
