# Isometric Designs — Step-by-step deployment guide

This project is a static React/Vite frontend. It uses Firebase Authentication and Cloud Firestore directly from the browser, and can forward quote requests to an existing Render API. The repository includes a Render Blueprint and GitHub Actions workflows. Do not commit .env files, private keys, service-account JSON, or Firebase Admin credentials.

## 1. Prepare Firebase

1. Create or select a Firebase project at console.firebase.google.com.
2. Add a Web app in Project settings and copy its web configuration values.
3. In Authentication, enable Email/Password sign-in. Create admin user accounts only for approved staff.
4. Create the Cloud Firestore database in the region appropriate for your users and data.
5. In a trusted server-side environment using the Firebase Admin SDK, assign the custom claim admin=true to each approved admin account. The client does not grant admin privileges. Example Admin SDK operation: setCustomUserClaims(uid, { admin: true }). Never put a service-account key in Vite or the browser.
6. Install the Firebase CLI in your trusted deployment environment, authenticate, select the correct project, and deploy the included rules with firebase deploy --only firestore:rules. Confirm the rules are active before accepting live quote requests.
7. Optional but recommended: configure Firebase App Check for the production domain, set the reCAPTCHA v3 site key, and enable enforcement for Firestore and Authentication after validating the app.
8. Add verified company contact details through Admin → Site settings after the first deploy.

The Firestore rules permit public creation of quote requests with validated fields; only authenticated users with the admin custom claim can read those requests, change project records, publish testimonials, or edit site settings. Review the rules before launch and configure App Check / abuse controls.

## 2. Configure the Render API

1. Confirm the backend is deployed and exposes POST /api/quotes (or the matching path under your API base URL).
2. Confirm its CORS policy allows the production website origin and accepts JSON requests.
3. The frontend saves a quote to Firestore first, then attempts the API relay. A relay failure does not remove the Firestore lead.
4. Set VITE_RENDER_API_URL to the API base, for example https://your-render-api.onrender.com/api. Leave it empty only if the relay is not used.

## 3. Deploy the static site to Render

1. In Render, choose New → Blueprint and connect the GitHub repository levixticus67-lab/Ivo.
2. Render reads render.yaml and creates the isometric-designs static site. Confirm the build command and SPA rewrite before creating the service.
3. Add the VITE_FIREBASE_* values from the Firebase Web app and VITE_RENDER_API_URL in Render’s environment settings. Add VITE_FIREBASE_APP_CHECK_KEY if App Check is configured.
4. Deploy. Render will run npm install, lint, and build, then publish dist.
5. Open the generated Render URL and verify that direct navigation and refresh work on /about, /services, /projects, /contact, and /admin/login.
6. In Firebase Authentication, add the production domain to the authorized domains list. Restrict the Firebase API key to approved web referrers in Google Cloud.
7. Check the browser console and Firestore usage dashboard. Confirm public pages only expose published projects/testimonials and quote submissions appear in the admin inbox.

## 4. Configure GitHub Actions

The CI workflow runs on pushes to main and pull requests targeting main. It installs dependencies, runs ESLint, and produces a Vite production build. Check the Actions tab after the first push; resolve any failed check before publishing a release.

For one-click manual Render deploys:

1. In the Render static-site settings, create a deploy hook and copy its URL.
2. In GitHub, open Settings → Secrets and variables → Actions → New repository secret.
3. Name the secret RENDER_DEPLOY_HOOK_URL and paste the hook URL there. Do not put it in source files or workflow logs.
4. Open Actions → Deploy Render static site → Run workflow. The workflow sends a POST to the secret deploy hook.
5. Verify deployment status in Render. The CI workflow remains the required build check; the manual deploy workflow is a trigger, not a substitute for reviewing the Render deployment result.

## 5. Operational checks

- Create and verify the first admin custom claim before opening admin routes to staff.
- Test one quote end-to-end, confirm it is in Firestore, confirm the backend relay behavior, and verify the admin can move it through New, In Review, Contacted, and Closed.
- Add projects and testimonials only after the company approves their text, images, client references, and publication status.
- Add privacy and data-retention notices appropriate to the company’s jurisdiction before collecting real contact data.
- Monitor Firestore costs, App Check metrics, Render build/deploy logs, and GitHub Actions.

## 6. Useful commands

- Install packages: npm install
- Lint: npm run lint
- Production build: npm run build
- Deploy Firestore rules: firebase deploy --only firestore:rules

Environment keys are listed in .env.example. The Firebase Web API key is not a server secret, but it should be referrer-restricted. Firebase Admin/service-account credentials and the Render deploy-hook URL are secrets and must be stored only in a trusted secret manager.
