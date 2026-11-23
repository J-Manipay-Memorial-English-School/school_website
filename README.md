# J/Manipay Memorial English School — Official Bilingual Web Portal & Admin CMS

<p align="center">
  <strong>Official Bilingual (Tamil & English) Institutional Web Platform & Serverless Admin CMS</strong><br />
  <em>யா/மானிப்பாய் மெமோறியல் ஆங்கிலப் பாடசாலை — Memorial Lane, Manipay, Jaffna, Sri Lanka</em>
</p>

---

## 1. Project Overview & Purpose

This repository hosts the official bilingual (**English** and **Tamil / தமிழ்**) institutional web portal and integrated **Admin Content Management System (CMS)** for **J/Manipay Memorial English School** (*1AC Provincial School, Est. 1924*, located at Memorial Lane, Manipay, Jaffna, Sri Lanka).

The platform was engineered to eliminate technical barriers and ongoing hosting expenses while giving the school a fast, accessible, modern digital presence:

- **For Students, Parents, Alumni & Visitors:** A responsive, accessible, zero-reload bilingual portal featuring live enrollment statistics, academic pathways, faculty and former principal directories, scholarship and G.C.E. O/L & A/L exam results, downloadable PDF circulars, event albums, and school contact details.
- **For Non-Technical School Administrators (`/admin`):** A built-in, password-protected Admin CMS designed for day-to-day updates directly from a desktop computer or mobile phone—requiring zero coding knowledge, zero database administration, and zero recurring server hosting fees.

---

## 2. Author & Institutional Handover Credit

This platform was **solely designed, architected, and developed** by:

- **Jegathayini Thiruchchelvam** — GitHub: [@Jegathayini](https://github.com/Jegathayini)  
  *Computer Science & Engineering Undergraduate, University of Moratuwa*

This repository is hosted under the official **J/Manipay Memorial English School** GitHub Organization as part of a **permanent, zero-cost institutional digital handover** to support the school's ongoing administration and community outreach.

---

## 3. Tech Stack

| Layer | Technologies & Services | Implementation Details in Codebase |
| :--- | :--- | :--- |
| **Frontend UI & Styling** | **React 19**, **TypeScript**, **Tailwind CSS v4** (`@tailwindcss/vite`), **HTML5 / CSS3** | Component-driven SPA (`src/App.tsx`), dynamic `--brand-primary` / `--brand-accent` CSS custom properties, class-based Light/Dark theming (`dark`), and responsive single-row bilingual layout (`src/index.css`). |
| **Build Tool & Local Dev** | **Vite 8** (`@vitejs/plugin-react`), **Express**, **tsx** | Production static bundle generation (`vite build` to `dist/` with automatic `src/assets` copy plugin in `vite.config.ts`), plus local full-stack API emulation via `server.ts`. |
| **Typography & Icons** | **Google Fonts**, **Lucide React** (`lucide-react`), **Motion** (`motion/react`) | Editorial typography (`Fraunces`, `Plus Jakarta Sans`, `Noto Sans Tamil`, `JetBrains Mono` in `index.html`), crisp iconography, and smooth route/drawer/lightbox animations. |
| **Serverless Backend API** | **Cloudflare Pages Functions** (`functions/api/*.ts`) | Edge HTTP handlers (`_middleware.ts`, `_auth.ts`, `auth.ts`, `school-data.ts`, `upload.ts`) using Web Standards (`Request`/`Response`, `FormData`, Web Crypto API `crypto.subtle`). |
| **Edge Database / State** | **Cloudflare Workers KV** (`SCHOOL_KV`) + **React Context** | Stores normalized institutional JSON under key `jmmes_school_data_v1` in `SCHOOL_KV`, hydrated client-side via `SchoolDataContext.tsx` and cached locally in `localStorage`. |
| **Cloud Media & Documents** | **Cloudinary Programmable Media API** | Signed server-side uploads (`POST /api/upload`) to the `jmmes-portal` folder with automatic raster optimization (`f_auto,q_auto`) and raw PDF hosting via HTTPS CDN URLs. |
| **Hosting, VCS & CI/CD** | **GitHub Organization** + **Cloudflare Pages** | Automated edge builds and zero-downtime deployments triggered on pushes to `main`. |

---

## 4. Key Features

### Public Bilingual Portal
- **Instant Bilingual Switching (English / தமிழ்) with Smart Fallback:** Zero-reload language toggle in the header (`src/data/uiStrings.ts`). Using `pickText()`, `pickList()`, and `pickSubjectList()` (`src/utils/schoolHelpers.ts`), single-language records entered by staff automatically fall back cleanly so visitors never see blank cards or broken headings.
- **Sticky Editorial Header & Live Announcement Ticker (`Header.tsx`):** Scrolling school bulletin strip, compact navigation bar (`Home`, `Heritage`, `Academics`, `Staff`, `Former Principals`, `Exam Results`, `Notices`, `Honours`, `Gallery`, `Contact`) engineered with `whitespace-nowrap` stability across Tamil and English, responsive mobile drawer, Light/Dark toggle, and language switcher.
- **Theme-Protected School Crest (`SchoolCrest.tsx`):** Renders the official school emblem inside a neutral shield/circular backing across the header, hero, motto spotlight, footer, and admin sidebar—preserving original crest colors without Dark-mode inversion or accent tinting.
- **Global Quick Search (`CommandSearchModal.tsx`):** Accessible from the top bar or via `Ctrl+K` / `Cmd+K` to search notices, academic pathways, subjects, staff members, former principals, honours, and exam results.
- **Dynamic Home Hub (`activeTab === 'home'`):**
  - **Hero Banner (`HeroSection.tsx`):** School crest lockup, established/location tag, bilingual headline, editable primary/secondary CTA buttons, and parallax banner photography.
  - **Live Student Statistics & Class Strength (`StatsBar.tsx`):** Automated total active student counter (Boys + Girls sub-counters), academic staff, non-academic staff, and prefect counts, plus an expandable Grade 1–13 class-wise breakdown accordion.
  - **Motto Spotlight (`MottoSpotlight.tsx`) & Principal's Desk (`PrincipalDesk.tsx`):** Motto display and Principal portrait, qualifications, tenure, summary quote, and expandable full welcome message.
  - **Glimpses of Our School (`HomeGallerySection.tsx`):** Interactive editorial spotlight & thumbnail filmstrip carousel with pause-on-hover, touch/arrow navigation, optional captions, and full-screen lightbox.
  - **Our Smart Systems (`SmartSystemsSection.tsx`):** Quick-launch directory linking to external digital school platforms (e.g., *ReliefMS*, *Smart Attendance*, *Marks & Report System*, *Digital Bell System*).
- **Dedicated Institutional Tabs:**
  - **Heritage (`HeritageSection.tsx`):** Interactive sub-tabs for *History & Founder*, *Vision & Mission*, *School Motto*, and *School Anthem* (featuring a Web Audio chime stanza player).
  - **Academics (`AcademicsSection.tsx`):** Dynamically editable curriculum overview with customizable filter pills (*All Levels*, *Primary 1–5*, *Junior Secondary 6–11*, *GCE A/L Streams*) and reorderable subject lists.
  - **Staff (`StaffSection.tsx`) & Former Principals (`FormerPrincipalsSection.tsx`):** Principal leadership highlight, section-filterable Academic Faculty directory with automatic initials fallback badges, and a Past Principals tribute directory with service tenures and silhouette fallbacks.
  - **Exam Results (`ExamResultsSection.tsx`):** Filterable across *Grade 5 Scholarship*, *G.C.E. O/L*, and *G.C.E. A/L* with prominent pass percentage highlights, top achievers (marks/Z-scores/portraits), and celebration photo lightboxes.
  - **Notices & Circulars (`NoticesSection.tsx`):** Searchable and category-filterable notice board (*Exams*, *Circulars*, *Events*) with pinned notices, official reference codes, full notice reader drawer, and inline PDF/image preview + direct download links.
  - **Honours (`AchievementsSection.tsx`) & Event Gallery (`GallerySection.tsx`):** Categorized school distinctions and multi-photo event albums with album counters and multi-image lightbox navigation.
  - **Contact & School Location (`ContactSection.tsx`) & Dynamic Footer (`Footer.tsx`):** Reorderable contact cards (auto-linked `tel:`, `mailto:`, web links), social/quick links, embedded Google Map, and multi-column footer with configurable links and copyright notice.

### Password-Protected Admin CMS (`/admin`)
Accessible from the footer's **Admin Portal** link or `/admin`, the CMS provides **13 dedicated management modules** (`src/components/admin/AdminPortal.tsx`):

1. **General, Crest & Hero (`AdminGeneralPanel.tsx`):** Edit school names, compact header name, primary address, school classification, announcement ticker label and items, Hero eyebrow/CTA buttons, heritage fields, and upload School Crest / Hero Banner media.
2. **Stats, Strength & Principal (`AdminPrincipalStatsPanel.tsx`):** Update staff/prefect counts, manage Grade 1–13 Boys/Girls class strengths (auto-computing total active students), and edit Principal portrait and welcome addresses.
3. **Academic Pathways (`AdminAcademicsPanel.tsx`):** Edit section headings, manage custom curriculum filter tabs, and create/reorder/delete pathway cards and individual bilingual subjects.
4. **Teachers / Staff (`AdminStaffPanel.tsx`):** Full CRUD, section categorization, optional photo upload, and up/down reordering.
5. **Former Principals (`AdminFormerPrincipalsPanel.tsx`):** Full CRUD, tenure dates, notes, optional portraits, and reordering.
6. **Exam Results (`AdminExamResultsPanel.tsx`):** Manage Scholarship, O/L, and A/L records, nested top-achiever rows, and multi-photo result celebrations.
7. **School Glimpses (`AdminHomeGalleryPanel.tsx`):** Manage Home carousel photos, optional EN/TA captions, dates, and slide order.
8. **Smart Systems (`AdminSmartSystemsPanel.tsx`):** Edit titles, descriptions, URLs, and Home-page visibility toggles (`Visible on Home` / `Hidden`).
9. **Notices Manager (`AdminNoticesPanel.tsx`):** Publish, edit, pin/unpin, and delete notices with direct PDF or image circular uploads.
10. **Achievements & Gallery (`AdminAchievementsGalleryPanel.tsx`):** Manage awards/honours and multi-photo Event Gallery albums.
11. **Contact & Map (`AdminContactPanel.tsx`):** Edit Contact section headings, paste a Google Maps URL or full `<iframe>` embed code (auto-extracts `src`), manage reorderable contact cards, and manage social/quick links.
12. **Footer Manager (`AdminFooterPanel.tsx`):** Configure footer brand description, social link visibility, reorderable footer columns (`one-col` / `two-col`) and links (`tab`, `url`, or `text`), import contact details with one click, and customize copyright/Admin button text.
13. **Theme & Brand Studio (`AdminThemeBrandPanel.tsx`):** Apply institutional presets (*Heritage Crimson & Gold*, *Jaffna Royal Lapis*, *Palmyra Forest & Bronze*, *Academic Slate & Terracotta*), customize primary/accent hex colors live, or reset data to school defaults.

---

## 5. End-to-End Architecture & Deployment Workflow

```text
+-----------------------------------------------------------------------------+
|  GitHub Organization (J/Manipay Memorial English School) — Branch: main     |
+--------------------------------------+--------------------------------------+
                                       | Automatic CI/CD Trigger on Push
                                       v
+-----------------------------------------------------------------------------+
|  Cloudflare Pages Build & Edge Network                                      |
|  - Runs `npm run build` -> Vite outputs SPA & assets into `dist/`           |
|  - Compiles & deploys Serverless Functions from `functions/api/*`           |
+--------------------+-------------------------------------+------------------+
                     |                                     |
        Public Read  |                                     | Authenticated CMS
       (GET Request) |                                     | (`x-admin-password`)
                     v                                     v
+------------------------------------+   +------------------------------------+
|  GET /api/school-data              |   |  _middleware.ts & _auth.ts         |
|  - Reads `jmmes_school_data_v1`    |   |  - Guards POST/PUT/PATCH/DELETE    |
|    from Cloudflare KV (`SCHOOL_KV`)|   |  - Constant-time verification vs   |
|  - Hydrates client & caches in     |   |    `env.ADMIN_PASSWORD`            |
|    `localStorage` with fallback    |   +-----------------+------------------+
+------------------------------------+                     |
                                           +---------------+---------------+
                                           |                               |
                                           v                               v
                        +-------------------------------+   +-------------------------------+
                        |  PUT / DELETE /api/school-data|   |  POST /api/upload             |
                        |  - Updates/resets JSON state  |   |  - Browser compresses images  |
                        |    in `SCHOOL_KV`             |   |  - Edge Function signs SHA-1  |
                        |  - Immediately live for all   |   |    via Web Crypto API         |
                        |    visitors worldwide         |   |  - Uploads to Cloudinary      |
                        +-------------------------------+   |    (`jmmes-portal` folder)    |
                                                            |  - Returns HTTPS `secure_url` |
                                                            |    (`f_auto,q_auto` images)   |
                                                            +-------------------------------+
```

### Request & Storage Lifecycle
1. **Public Visitor Read Flow (`src/services/schoolService.ts` -> `functions/api/school-data.ts`):**
   - On page load, `fetchSchoolData()` requests `GET /api/school-data` (`cache: 'no-store'`).
   - Cloudflare Pages Functions reads `SCHOOL_KV.get('jmmes_school_data_v1')`, returns the live institutional JSON, and `normalizeSchoolData()` safely hydrates any missing schema fields against `DEFAULT_SCHOOL_DATA`.
   - If the KV namespace is not yet populated or offline, the portal gracefully falls back to cached `localStorage` or bundled seed data (`src/data/defaultSchoolData.ts`).
2. **Zero-Leakage Admin Authentication (`functions/api/_auth.ts`, `_middleware.ts`, `auth.ts`):**
   - No administrator password or secret exists anywhere in `src/`.
   - Signing in at `/admin` sends `POST /api/auth` with the `x-admin-password` header. The password is kept strictly in React memory (`SchoolDataContext.tsx`) for the active session.
   - `functions/api/_middleware.ts` intercepts every mutating HTTP method (`POST`, `PUT`, `PATCH`, `DELETE`) on `/api/*` and validates `x-admin-password` against `env.ADMIN_PASSWORD` using constant-time byte comparison. Invalid credentials return `401 Unauthorized` and immediately clear the client admin session.
3. **Media & PDF Upload Pipeline (`src/utils/schoolHelpers.ts` -> `functions/api/upload.ts`):**
   - Images selected from desktop or phone storage are resized and compressed in-browser via HTML5 Canvas (`readImageFileAsDataUrl`, preserving PNG/SVG transparency), while PDFs are validated up to 4 MB (`readAttachmentFile`).
   - `uploadMediaFile()` sends the validated Base64 data URL to `POST /api/upload` (enforcing an 8 MB ceiling and strict MIME allowlist for PNG, JPEG, WebP, GIF, SVG, and PDF).
   - `functions/api/upload.ts` generates a Cloudinary SHA-1 signature using the Cloudflare Workers Web Crypto API (`crypto.subtle.digest('SHA-1', ...)` — no Node `crypto` dependency) and uploads to `jmmes-portal` (`image` or `raw` resource type).
   - Returned raster image URLs automatically include `/image/upload/f_auto,q_auto/` for optimal format/quality CDN delivery, and only the lightweight HTTPS URL is stored in `SCHOOL_KV`.
4. **Automated CI/CD Deployment:**
   - Any commit merged or pushed to the `main` branch in the school's GitHub Organization triggers Cloudflare Pages to run `npm run build`, bundle `dist/` (including unbundled assets under `src/assets/`), and publish updated edge functions globally within seconds.

---

## 6. Project Folder Structure

```text
.
├── .env.example                          # Template for local/deployment environment variables
├── index.html                            # HTML entry point, SEO/OpenGraph tags & Google Fonts
├── metadata.json                         # Application metadata
├── package.json                          # Scripts (dev, build, preview, lint) & dependencies
├── server.ts                             # Local Express + Vite dev server emulating /api/* routes
├── tsconfig.json                         # TypeScript compiler configuration
├── vite.config.ts                        # Vite 8 + Tailwind v4 config & dist asset copy plugin
├── functions/
│   └── api/
│       ├── _auth.ts                      # Constant-time x-admin-password check & KV/Env types
│       ├── _middleware.ts                # Protects all POST/PUT/PATCH/DELETE /api/* requests
│       ├── auth.ts                       # POST /api/auth credential verification endpoint
│       ├── school-data.ts                # GET/PUT/POST/DELETE /api/school-data backed by SCHOOL_KV
│       └── upload.ts                     # Signed Cloudinary uploader (images + PDFs) via Web Crypto
└── src/
    ├── App.tsx                           # Public 10-tab router, /admin route switcher & Ctrl+K search
    ├── main.tsx                          # React 19 root mount
    ├── index.css                         # Tailwind CSS v4 directives, fonts, brand vars & marquee CSS
    ├── assets/images/                    # Default bundled crest, hero, glimpses, faculty & event photos
    ├── types/school.ts                   # Complete TypeScript schema (SchoolData & CMS interfaces)
    ├── data/
    │   ├── defaultSchoolData.ts          # Bilingual (EN/TA) institutional seed data
    │   └── uiStrings.ts                  # Bilingual UI dictionary for public portal chrome & sections
    ├── utils/schoolHelpers.ts            # Bilingual fallbacks, canvas image compression & PDF reader
    ├── services/schoolService.ts         # API client, KV normalization & localStorage cache fallback
    ├── context/SchoolDataContext.tsx     # Global state, theme/language persistence & CMS actions
    └── components/
        ├── Header.tsx                    # Ticker bar, crest lockup, single-row nav & controls
        ├── Footer.tsx                    # Dynamic multi-column footer, social links & /admin link
        ├── CommandSearchModal.tsx        # Ctrl+K / Cmd+K instant bilingual search dialog
        ├── SchoolCrest.tsx               # Theme-protected school crest badge renderer
        ├── SafeImage.tsx                 # Resilient <img> wrapper with fallback handling
        ├── ToastContainer.tsx            # Action & error notification toast stack
        ├── HeroSection.tsx               # Home hero banner
        ├── StatsBar.tsx                  # Live counters & Grade 1–13 strength breakdown table
        ├── MottoSpotlight.tsx            # School motto banner strip
        ├── PrincipalDesk.tsx             # Current Principal portrait & expandable welcome address
        ├── HomeGallerySection.tsx        # "Glimpses of Our School" editorial spotlight & filmstrip
        ├── SmartSystemsSection.tsx       # External digital school system portal cards
        ├── HeritageSection.tsx           # History, Vision/Mission, Motto & interactive School Anthem
        ├── AcademicsSection.tsx          # Filterable curriculum pathways & subject lists
        ├── StaffSection.tsx              # Principal highlight & filterable Academic Staff directory
        ├── FormerPrincipalsSection.tsx   # Chronological former principals tribute grid
        ├── ExamResultsSection.tsx        # Scholarship, O/L & A/L results, top achievers & lightbox
        ├── NoticesSection.tsx            # Filterable notices, full reader drawer & PDF/image preview
        ├── AchievementsSection.tsx       # Academic, Sports & Co-Curricular honours cards
        ├── GallerySection.tsx            # Multi-photo event albums & lightbox viewer
        ├── ContactSection.tsx            # Dynamic contact cards, quick links & Google Map embed
        └── admin/
            ├── AdminLogin.tsx            # Server-verified /admin sign-in screen
            ├── AdminPortal.tsx           # 13-module CMS workspace & sidebar
            ├── AdminGeneralPanel.tsx     # Identity, Crest, Banner, Ticker, Hero & Heritage manager
            ├── AdminPrincipalStatsPanel.tsx # Counters, Class 1–13 strengths & Principal editor
            ├── AdminAcademicsPanel.tsx   # Curriculum headings, filter pills, pathways & subjects
            ├── AdminStaffPanel.tsx       # Academic faculty CRUD & ordering
            ├── AdminFormerPrincipalsPanel.tsx # Former principals tribute CRUD & ordering
            ├── AdminExamResultsPanel.tsx # Exam results, top performers & celebration photos CRUD
            ├── AdminHomeGalleryPanel.tsx # School Glimpses carousel manager
            ├── AdminSmartSystemsPanel.tsx# Smart systems links & visibility toggles
            ├── AdminNoticesPanel.tsx     # Notices, pinning & PDF/image circular uploads
            ├── AdminAchievementsGalleryPanel.tsx # Honours & multi-photo event albums manager
            ├── AdminContactPanel.tsx     # Contact headings, map embed parser, cards & social links
            ├── AdminFooterPanel.tsx      # Footer columns, links, contact importer & copyright
            └── AdminThemeBrandPanel.tsx  # Brand color presets, hex customizer & reset controls
```

---

## 7. Environment Variables, KV Bindings & Setup Guide

### Required Cloudflare Pages Configuration

#### 1. KV Namespace Binding
In **Cloudflare Dashboard → Workers & Pages → `<Project>` → Settings → Functions → KV Namespace Bindings**:

| Variable Name (Binding) | KV Key Used | Purpose |
| :--- | :--- | :--- |
| `SCHOOL_KV` | `jmmes_school_data_v1` | Stores the live bilingual `SchoolData` JSON object edited via the Admin CMS. |

#### 2. Environment Variables & Encrypted Secrets
Set the following in **Cloudflare Pages → Settings → Environment Variables** (mark secret values as **Encrypted** for both Production and Preview as needed):

| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | **Yes** | Server-side administrator password validated against the `x-admin-password` header in `_auth.ts` and `_middleware.ts`. |
| `CLOUDINARY_CLOUD_NAME` | **Yes** (Prod) | Cloudinary account cloud name for media/PDF storage (`functions/api/upload.ts`). |
| `CLOUDINARY_API_KEY` | **Yes** (Prod) | Cloudinary API key used to authenticate signed uploads. |
| `CLOUDINARY_API_SECRET` | **Yes** (Prod) | Cloudinary API secret used to compute SHA-1 upload signatures via Web Crypto. |
| `VITE_APP_NAME` | Optional | Optional app display title override (see `.env.example`). |

#### 3. Build & Deployment Settings (Cloudflare Pages)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Production Branch:** `main`

---

### Local Development Setup

For developers maintaining or extending the platform locally (`server.ts` runs Express on port `3000` with Vite middleware, in-memory `/api/school-data` storage, and optional Cloudinary upload pass-through):

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   npm install
   ```
2. **Create a `.env` file from `.env.example`:**
   ```bash
   cp .env.example .env
   ```
   Set at minimum `ADMIN_PASSWORD=your-local-password` (if Cloudinary variables are omitted locally, `server.ts` cleanly echoes uploaded data URLs in memory for testing; set all three `CLOUDINARY_*` values to test live Cloudinary uploads).
3. **Run local dev server, type-checking, or production build:**
   ```bash
   npm run dev      # Starts Express + Vite dev server at http://localhost:3000
   npm run lint     # Runs TypeScript type-checking (`tsc --noEmit`)
   npm run build    # Builds production bundle into `dist/`
   ```

---

## 8. Attribution & License Notice

This software was designed and built specifically for **J/Manipay Memorial English School** by **Jegathayini Thiruchchelvam** ([@Jegathayini](https://github.com/Jegathayini), Department of Computer Science & Engineering, University of Moratuwa) and handed over to the school's official GitHub Organization for permanent institutional stewardship.

**Notice to Future Maintainers:**  
You are welcome to maintain, update, and extend this portal for **J/Manipay Memorial English School**. When reusing, forking, or modifying this repository, please **preserve the original author attribution and institutional handover credit** to **Jegathayini Thiruchchelvam (@Jegathayini)** in this `README.md` and repository documentation.
