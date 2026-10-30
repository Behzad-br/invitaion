# WAEN — Western Australian Curriculum (Karachi Launching Ceremony 2026)

A mobile-first, animated VIP digital invitation website for the **Western Australian Curriculum — Karachi Launching Ceremony 2026**, hosted by the **Western Australia Education Network (WAEN Pakistan)** in association with the **Government of Western Australia** and **School Curriculum and Standards Authority (SCSA International)**.

## Features

- **Scene 1 — Cinematic 3D Envelope Opening:** Genuine CSS 3D perspective envelope with metallic champagne-gold medallion seal, embossed WAEN crest, particle dispersion, rising VIP invitation card, and accessible *Skip Animation* / *Reopen Invitation* controls.
- **Scene 2 — Official Institutional Reveal:** Displays the three genuine institutional logos (*WAEN Pakistan*, *Government of Western Australia*, *SCSA International*) with staggered GSAP reveals and scroll-parallax silk ribbons.
- **Scene 3 — Ceremony Details & Live Countdown:** Animated 3D cards for Date (`Thursday, 12 November 2026`), Time (`10:00 AM – 01:00 PM PKT`), and Venue (`Marriott Hotel, Karachi`), real-time countdown timer, valid `.ics` calendar download, and Google Maps directions.
- **Scene 4 — Animated Karachi Skyline:** Editorial purple & champagne-gold architectural skyline featuring **Mazar-e-Quaid**, Frere Hall spires, Merewether Clock Tower, and modern Karachi towers with mirrored light reflection and scroll-animated silk ribbons.
- **Scene 5 — Interactive WhatsApp RSVP & Organizer Link Builder:** Dynamic validation, properly URL-encoded `https://wa.me/NUMBER?text=...` message generation, clipboard fallback, and discreet Organizer Setup screen.

---

## 1. Local Development & Build Instructions

### Prerequisites
- Node.js 18+ and npm

### Install & Run Development Server
```bash
npm install
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 2. Configuring the Official WAEN WhatsApp Number

No placeholder phone number is hardcoded. You can configure the official WAEN WhatsApp number in two ways:

### Option A — Production Environment Variable (Recommended)
Create a `.env` file in the project root (or set the variable in your hosting dashboard):

```env
VITE_WAEN_WHATSAPP_NUMBER=923001234567
```
*(Use international digits only: country code + number, with **no** `+`, spaces, or hyphens.)*

### Option B — Organizer Shareable Link Generator
1. Open the website and click **Organizer Setup** in the footer (or open `https://your-domain.com/?setup=1`).
2. Enter the official WAEN WhatsApp number in international format (e.g., `923XXXXXXXXX`).
3. Copy or share the generated multi-school invitation URL:
   `https://your-domain.com/?wa=923XXXXXXXXX`

> **Security Note:** Query-parameter numbers (`?wa=...`) are convenient for quick sharing, but are not authenticated against URL edits. For the official public production deployment, set `VITE_WAEN_WHATSAPP_NUMBER` in your hosting environment variables.

---

## 3. Deploying to a Public HTTPS URL

### Deploy on Vercel (Recommended — Free HTTPS)
1. Push this folder to a GitHub repository (or install Vercel CLI: `npm i -g vercel`).
2. In Vercel, import the repository:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Under **Settings → Environment Variables**, add:
   - `VITE_WAEN_WHATSAPP_NUMBER` = `923XXXXXXXXX` (your verified WAEN number)
4. Click **Deploy**. Your public `https://...vercel.app` link (or custom domain) is ready to share on WhatsApp with full Open Graph preview card support.

### Deploy on Netlify / Cloudflare Pages
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variable:** `VITE_WAEN_WHATSAPP_NUMBER=923XXXXXXXXX`

