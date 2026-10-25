# Isometric Designs — deployment and image upload guide

This project has two Render services: a public React/Vite static site and a small Node API that verifies admin sessions and sends uploaded images to Cloudinary. Firebase Auth and Firestore remain the source for admin identity and public content. The images are stored in Cloudinary; their secure URLs and metadata are saved in Firestore.

Never commit .env files, Firebase service-account private keys, Cloudinary API secrets, or Render deploy-hook URLs. Do not send credentials in chat.

## 1. Firebase setup

1. In Firebase Console, create or select the project and add a Web app. Copy the web app values for the frontend environment variables listed in section 3.
2. In Authentication, enable Email/Password sign-in and create accounts only for approved staff.
3. Create Cloud Firestore in the region appropriate for your users and data.
4. In a trusted server-side environment using Firebase Admin SDK, assign the custom claim admin=true to each approved admin account. The client cannot grant itself access. Never put service-account credentials in a Vite variable or the browser.
5. Add the production website domain to Firebase Authentication authorized domains.
6. Deploy the included Firestore rules with Firebase CLI: firebase deploy --only firestore:rules. The rules allow validated public quote creation and restrict project, testimonial, lead, and site-settings access to admins.
7. Optional: configure Firebase App Check for the production domain and enable enforcement after verifying the app.

For the Render API, create a Firebase service account in Firebase Console → Project settings → Service accounts. Store its project ID, client email, and private key only in the API service’s Render environment variables described below. The private key is server-only.

## 2. Cloudinary setup

1. Create or select a Cloudinary account and open the dashboard / API settings.
2. Copy the Cloud name and API key. Keep the API secret private.
3. In Render, add the Cloudinary values only to the isometric-designs-api service: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.
4. Do not create a public unsigned upload preset. The site sends an image to the API; the API verifies the Firebase ID token and admin claim, applies an approved image scope, enforces image format and a 10 MB limit, then uploads the file to Cloudinary.

The frontend’s upload buttons accept JPG, PNG, WebP, and AVIF. Image assets are organized into fixed Cloudinary folders for hero, About, contact, services, project covers, project galleries, and testimonials. The API returns Cloudinary’s secure URL and public ID; the admin page saves the image with the Firestore record. Click Save on the relevant form to publish the uploaded image.

## 3. Deploy the Render services

1. In Render, sync the existing Blueprint from this repository or create a new Blueprint connected to levixticus67-lab/Ivo. Review the plan before confirming: the Blueprint declares a free Render web service for the image API and the existing static site.
2. Configure the isometric-designs-api service with these environment variables:
   - FIREBASE_PROJECT_ID — same project as the frontend Firebase app.
   - FIREBASE_CLIENT_EMAIL — service-account client email.
   - FIREBASE_PRIVATE_KEY — service-account private key. Paste it into Render’s secret value field; do not add it to GitHub.
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — from Cloudinary.
   - CORS_ORIGIN — https://isometric-designs.onrender.com. Add localhost:5173 as a comma-separated extra origin only for development.
3. Configure the static site with its VITE_FIREBASE_* values from the Firebase Web app. VITE_UPLOAD_API_URL is linked by the Blueprint to the API service host; if your existing static service is not managed by the Blueprint, set it to the API URL followed by /api, for example https://isometric-designs-api.onrender.com/api.
4. Leave VITE_RENDER_API_URL empty unless you have a separate quote-relay API. It is not the image API URL.
5. Save the service environment changes and deploy/redeploy the API and frontend. Vite embeds VITE_* values during the build, so the frontend must be rebuilt after changing its environment variables.
6. Check the API health URL at https://YOUR-API-SERVICE.onrender.com/api/health. It should respond with ok=true and configuration booleans; it never returns credentials. If the service name differs, use the host shown in Render.
7. Open the website and sign in at /admin/login using a Firebase account with admin=true. In Site settings, Projects, or Testimonials, use the Upload image button, then save the record. Verify the published image on the public page.

Render free web services may sleep when idle, so the first image upload after inactivity can take longer. Select a higher service plan if that delay is unsuitable for the business.

## 4. GitHub Actions

The CI workflow checks frontend ESLint and production build, then installs the API dependencies and runs API syntax and upload validation tests on pushes to main and pull requests. Automatic Render deployments can deploy both services after a successful push when enabled in Render.

For manual deploys, create a separate Render deploy hook for each service, then add the hook URLs as GitHub repository Actions secrets:

- RENDER_DEPLOY_HOOK_URL for the static site workflow.
- RENDER_API_DEPLOY_HOOK_URL for the image API workflow.

Keep hook URLs in GitHub Secrets, not source files or logs.

## 5. Sample imagery and go-live checklist

- Four generated concept images are included in public/demo-images and shown as illustrative examples across the public site.
- The portfolio shows three labelled sample concepts only when Firestore has no published project records. They are not actual company work. Publishing a real project replaces the sample set.
- Replace homepage, About, contact, and service imagery with company-approved images in Admin → Site settings. Add approved photos to project covers/galleries and client portraits only when the company has permission to publish them.
- Verify that an admin upload appears on the public site after saving and that a signed-in non-admin account receives a 403 from the API upload route.
- Confirm the company’s privacy notice, verified contact details, real portfolio permissions, and image rights before go-live.

## 6. Commands

- Frontend: npm install, npm run lint, npm run build.
- API: cd server, npm install, npm run check, npm test.
