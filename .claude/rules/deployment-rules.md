# Deployment Rules

## CRITICAL: No Production Deployment Without Explicit Approval

- NEVER deploy to production (Vercel, Netlify, or any hosting) without explicit user instruction
- "Deploy to production" or similar must be explicitly stated by the user
- Suggesting deployment is fine, but do not execute it

## What IS allowed without approval:
- Local development server (`npm run dev`)
- Running tests (`npm test`)
- Production builds locally (`npm run build`)
- Preview builds locally (`npm run preview`)

## What REQUIRES explicit approval:
- `vercel` or `vercel --prod`
- `netlify deploy` or `netlify deploy --prod`
- Any git push to main/master (if CI/CD auto-deploys)
- Any hosting platform deployment commands

## Before deployment (when approved):
1. All tests must pass
2. Production build must succeed without errors
3. Manual verification of key features
