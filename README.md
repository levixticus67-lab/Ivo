# Isometric Designs Company Limited

A React, Vite, and Tailwind public website with a Firebase-backed admin dashboard for Isometric Designs Company Limited.

## Included

- Public routes: home, about, services, projects, and contact / quote request.
- Admin routes: Firebase sign-in, analytics overview, project CRUD, quote inbox, testimonial publishing, and contact settings.
- Firestore real-time data for projects, testimonials, quote requests, and public site settings.
- Firebase custom-claim authorization and restrictive Firestore rules. Public visitors can create validated quote requests; only an admin can read leads or edit site data.
- Optional Render API relay through a centralized fetch service.
- Render static-site Blueprint, GitHub Actions CI, and a manual Render deploy-hook workflow.

## Local setup

1. Install Node.js 20 or later.
2. Run npm install.
3. Copy .env.example to .env.local and enter the Firebase web app configuration and Render API URL.
4. Configure Firebase Authentication, Firestore, and administrator custom claims as described in DEPLOYMENT_GUIDE.md.
5. Run npm run dev for local development, npm run lint for lint checks, and npm run build for a production build.

No Firebase credentials or service-account keys belong in this repository. Vite client environment values are bundled into the public frontend; Firebase API keys should be referrer-restricted and Firestore rules must be deployed.

## Deploy

Use the step-by-step [deployment guide](DEPLOYMENT_GUIDE.md). The Render Blueprint describes a static site and SPA rewrite. GitHub Actions runs lint and build checks for pushes to main and pull requests. A separate workflow can trigger a Render deploy hook manually.

## Data model

- projects: title, category, status, location, imageUrl, client, summary, description, isPublished, timestamps.
- quotes: contact details, project brief, status, createdAt.
- testimonials: quote, name, role or company, isPublished.
- siteSettings/public: verified address, phone, email, working hours, map link, and tagline.

The repository contains no sample client records, testimonials, employee identities, project claims, or company certifications. Add only details the company has verified.
