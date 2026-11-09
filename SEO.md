# GCC — Garg Core Construction SEO & Deployment Guide

Production identity: https://gargcoreconstruction.com
Target service area: Noida, Jewar, Greater Noida, and Delhi NCR.

## Implemented SEO & Social Sharing
- **Meta & Open Graph**: Full metadata suite in `index.html` (title, 158-character description, canonical link, Open Graph cards, Twitter summary_large_image).
- **Social Sharing Banner**: `public/og-image.jpg` (1200×630 px, ~201 KB, strictly under 300 KB for WhatsApp preview card compatibility).
- **Icons**: Vector SVG favicon, `public/apple-touch-icon.png` (180×180 px), `favicon-32x32.png`, `favicon-16x16.png`, and `public/site.webmanifest` (192px/512px).
- **Schema.org Structured Data**: JSON-LD with `Organization` and `GeneralContractor` / `HomeAndConstructionBusiness` entities targeting Noida, Jewar, Greater Noida, and Delhi NCR.
- **Search Engine Crawlers**: `public/robots.txt` allowing standard search and AI crawlers with sitemap link; `public/sitemap.xml` indexing live routes.
- **Vercel SPA Deployment**: `vercel.json` configured with rewrites to prevent 404s on subpages (`/about`, etc.) and cache-control headers for static assets.

## Vercel Deployment Checklist
1. Connect GitHub repository to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (or `tsc -b && vite build`).
4. Output Directory: `dist`.
5. Under **Domains**, add the production custom domain (e.g. `gargcoreconstruction.com`) and configure `www` redirect.
6. Verify `/robots.txt`, `/sitemap.xml`, and `/og-image.jpg` return HTTP 200 on the live domain.
7. Test social previews on Facebook Sharing Debugger, LinkedIn Post Inspector, and WhatsApp.
