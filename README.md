# One Man Army — 5th Anniversary Frame Generator

A responsive, client-only React + Vite + TypeScript application. Members upload a photo, enter an English or Bangla name, select one of eleven classic layouts, reposition/zoom, and download a 1080 × 1080 PNG. No accounts, backend, analytics, or photo uploads.

## Run locally

Use Node.js 22.12+ or 24 and npm.

```sh
npm ci
npm run dev
```

Open the URL shown by Vite. Create a production build with `npm run build`, then inspect with `npm run preview`. Run deterministic crop, text-fitting, logo-aspect and PNG tests with `npm test`.

## Original branding assets

Both provided originals are included, unchanged:

- `public/logos/OMA.png`
- `public/logos/anniversary.png` (original filename: `Anniversary Poster For One Man Army_20261011_110100_0000.png`)

Images are drawn with aspect-ratio-preserving contain sizing. Neither original has been recolored, cropped, or regenerated. If either asset cannot load, the page shows a warning and disables exports. Place replacement originals in those exact paths. Do not substitute recreations.

Typography uses locally bundled Google Fonts: Inter Variable and Noto Sans Bengali Variable. Runtime font requests do not go to Google. Wait for both fonts and both logo images before exporting.

## Original supplied design

The **Your Original Design** template, is the supplied `image.png`, copied byte-for-byte into `public/templates/provided-design.png`. It is the default selected template. The artwork, logos, gold border and fixed “Proud Member” badge are drawn intact. The photograph is clipped inside its rounded central opening. The member name is fitted into the bottom margin below the badge. Optional designation applies to the other layouts, so the supplied badge stays unchanged.

## Five new celebration designs

Signature Silk, Emerald Heritage, Pearl Celebration, Royal Ruby and Golden Togetherness use five individually generated textured backgrounds, matching the supplied red/green/gold quality. The gallery contains eleven classic designs, including the untouched supplied artwork. The four Modern templates and collection tabs have been removed. All eleven appear together in one two-column gallery. On mobile, the live preview follows the photo and name fields, before the gallery; a View My Frame link returns to the preview after choosing a design. New designs use the supplied logo PNGs as separate aspect-ratio-preserving elements, rather than generated logo replicas. Both newly attached logos match the previously supplied files byte-for-byte and are included unchanged.

The decorative heading uses locally bundled Cormorant Garamond Italic, so lettering does not depend on a system serif font. Names and Bangla use Inter and Noto Sans Bengali. Name and designation have a dedicated solid panel for readability. Backgrounds are local 1080px WebP assets, roughly 90–130 KB each; generation notes and prompt set are in `docs/background-prompts.md`.

## Square crop modal

Each new or replacement photo opens an accessible native dialog before changing the live frame. Drag, pinch or use the zoom slider; keyboard users can focus the crop area and use arrow keys. **Use This Crop** renders a 1080 × 1080 PNG and then places it in the selected frame. Grid lines and controls are outside the exported canvas. **Cancel** or Escape discards a new upload and retains the previous confirmed photo. **Crop Photo Again** reopens the retained source image to choose a different crop without repeated resampling. After confirmation, frame-specific positioning and zoom controls remain available. The modal traps focus, restores focus on closing, and prevents background scrolling.

## Photo adjustment and privacy

JPG/JPEG, PNG and WEBP up to 15 MB are accepted. Browser image decoding applies EXIF orientation; modern browsers use `createImageBitmap` with `from-image`, with an HTML image fallback. Decoded photographs are limited to a 2560-pixel longest edge for mobile memory use. A 100-megapixel ceiling rejects unusually large decoded images. All processing happens locally in memory. Temporary object URLs and image bitmaps are released.

Drag the photo within the preview, use the zoom slider or buttons, or pinch with two fingers. Arrow buttons provide keyboard-accessible positioning. Each template remembers its own crop; Reset centers it. The crop always fills its frame and cannot cover names or logos. Export uses the same Konva stage at a pixel ratio that produces exactly 1080 × 1080 pixels.

The upload is scaled down only when necessary; tiny source photos may look softer at export size. Use a clear, well-lit, high-resolution photo. No example face appears in final downloads.

## Sharing

Share Image uses native file sharing when supported. Otherwise, it downloads the image and instructs members to upload it manually. Share on Facebook opens Facebook’s supported website URL sharing dialog; it does **not** attach the PNG. Copy Caption requires the clipboard API in a secure context. Download remains available independently.

## Deploy

- **Vercel:** import this repository, select Vite, build `npm run build`, output `dist`.
- **Netlify:** build `npm run build`, publish directory `dist`. No redirects or backend are required.
- **GitHub Pages:** enable Actions deployment. The included `.github/workflows/pages.yml` installs, builds, and deploys `dist`. Vite uses relative URLs (`base: './'`) for repository subpaths. In repository Settings → Pages choose GitHub Actions.

Before public deployment, update `og:url` and `og:image` in `index.html` to absolute URLs for your domain. `public/social-preview.png` is the local Open Graph image; the original OMA image is the favicon. The application has no private runtime environment variables.

## Architecture

- `src/templates/`: six deterministic 1080px layout builders. Add a layout and register it in `index.ts` to extend the gallery.
- `src/components/FramePreview.tsx`: shared clipped Konva rendering, original logos, fit-to-box typography, and touch/drag handling.
- `src/hooks/`: upload lifecycle, asset/font loading, and per-template crop state.
- `src/utils/`: measured text wrapping, crop geometry, export and filenames.
- `tests/`: native Konva export tests with synthetic fixture imagery; no fixture is included in the web app.

## Verification

TypeScript and Vite production checks and automated PNG/crop/text tests are run during delivery. Tests generate all six designs with English, Bangla and long names and validate 1080 × 1080 PNG dimensions. Native canvas checks support deterministic rendering but do not replace browser interaction QA.

The managed environment does not expose its supported browser controller, so actual browser upload/drag/pinch/download, EXIF behavior on devices, crop modal focus/touch interaction, native sharing, and viewport checks at 360/390/768px and desktop remain unverified. CSS explicitly includes mobile and tablet breakpoints; confirm the remaining device checks before a public campaign launch.

## Organization profile and events
The About and Events sections use the organization profile supplied in October 2026. They include all 19 named initiatives, workshops and anniversary milestones in that document, the founder’s statement, focus areas, contact details and the Environmentalist Award. `public/organization/` contains locally hosted photos extracted from the supplied PDF and WebP renders of all 13 original pages. A keyboard-accessible dialog presents full profile pages. Images are lazy-loaded; no external image service is used. Event descriptions reflect the supplied document rather than an independently verified live event schedule.

Five additional layouts: Heritage Gallery (portrait and side panel), Pearl Cameo (oval), Memory Matte (forest green gallery matte), Heritage Embrace (curved portrait and seal), and Portrait of Impact (large photo and signature footer). All use the same original logo assets and shared crop/export renderer.
