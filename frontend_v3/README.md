<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/339f26e9-a45f-4db6-bbb8-a61ef2b95a31

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and set at least:
   - `VITE_API_URL=https://nattybackend.vercel.app`
   - `VITE_RECAPTCHA_ENABLED=false`
3. Run the app:
   `npm run dev`

## Deploy on Vercel

1. Import this folder as a separate Vercel project.
2. Set the project **Root Directory** to `frontend_v3`.
3. Add environment variables (same pattern as the current frontend):
   - `VITE_API_URL=https://nattybackend.vercel.app`
   - `VITE_RECAPTCHA_ENABLED=false`
   - `VITE_RECAPTCHA_SITE_KEY=...` (optional if captcha enabled)
4. Deploy.

The app now pings the backend on startup and logs connection status in the browser console.
