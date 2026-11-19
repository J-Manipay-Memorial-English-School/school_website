# J/Manipay Memorial English School — Bilingual Web Portal & Admin CMS

## 1. Project Overview & School Identity

This application is the official bilingual (**English** and **Tamil / தமிழ்**) web portal and built-in non-technical **Admin Content Management System (CMS)** for **J/Manipay Memorial English School** (*யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை*), a provincial 1AC mixed school located at **Memorial Lane, Manipay, Jaffna, Sri Lanka**.

Designed with a clean, prestigious academic editorial aesthetic, the portal serves students, parents, alumni, and school administrators through:
- **Zero-Reload Bilingual Switching:** Instant translation across navigation tabs, UI labels, headings, and school records between English and Tamil.
- **Dedicated Single-View Navigation:** Clean tab-based architecture (`Home`, `Heritage`, `Academics`, `Staff`, `Former Principals`, `Exam Results`, `Notices`, `Honours`, `Gallery`, and `Contact`) that avoids long single-page clutter and maintains single-row navbar stability in both English and Tamil.
- **Integrated School Administration (`/admin`):** Built-in CMS allowing school staff to update photos, notices, PDF circulars, exam results, staff profiles, student counts, smart system links, and brand colors directly from a computer or mobile phone without technical setup.

---

## 2. Public Portal Features (Section-by-Section)

### Persistent Chrome & Global Utilities
- **Live Bulletin Ticker & Sticky Glassmorphic Header (`Header.tsx`):** Displays scrolling school announcements at the top, followed by the school crest, school name, single-row 10-tab navigation (with responsive mobile drawer), **English / தமிழ்** language switcher, **Light / Dark mode** toggle, and quick search trigger.
- **Quick Academic Search (`CommandSearchModal.tsx`):** Accessible via the navbar search button or `Ctrl+K` / `Cmd+K` to search across notices, academic streams, subjects, honours, staff members, former principals, and exam results.
- **Theme-Protected School Crest (`SchoolCrest.tsx`):** Displays the official school crest inside a clean neutral circular badge across the Header, Hero, Motto Spotlight, Footer, and Admin CMS. True crest colors remain preserved without color tinting or inversion in Dark mode or custom brand palettes.
- **Light / Dark Mode & Live Accent Theming:** Visitors can toggle Light and Dark modes at any time, while CSS custom properties (`--brand-primary`, `--brand-accent`, `--brand-primary-soft`, `--brand-accent-soft`) dynamically style accents across buttons, badges, active indicators, and highlights.

### Home Hub (`activeTab === 'home'`)
1. **Hero Banner (`HeroSection.tsx`):** Parallax school photography with a high-contrast editorial scrim, school crest lockup, location/founding eyebrow, bilingual headline, and direct action buttons to **Academics** and **Contact & Location**.
2. **Live Active Student Statistics & Class Breakdown (`StatsBar.tsx`):**
   - Animated counters for **Active Students**, **Academic Staff**, **Non-Academic Staff**, and **Student Prefects**.
   - **Gender & Class-wise Strength Breakdown:** Displays **Boys** and **Girls** sub-counters directly on the Active Students card, with an interactive **View Class Breakdown** accordion showing Grade 1 through Grade 13 (GCE O/L & GCE A/L Streams) enrollment by Boys, Girls, and Class Total.
3. **Motto Spotlight (`MottoSpotlight.tsx`):** Highlights the school motto (*"Knowledge · Virtue · Service"* / *"அறிவு · ஒழுக்கம் · சேவை"*) alongside the school crest.
4. **From the Principal's Desk (`PrincipalDesk.tsx`):** Features the current Principal's portrait, credentials, tenure, summary welcome address, and an expandable **Read Full Address** toggle.
5. **Glimpses of Our School (`HomeGallerySection.tsx`):**
   - **Editorial Spotlight + Interactive Filmstrip** gallery showcasing school buildings, pathways, and grounds (managed independently from the Event Gallery).
   - Supports smooth crossfade transitions, auto-play with pause-on-hover, touch swipe and arrow navigation, clickable thumbnail filmstrip, optional captions (clean unobstructed photos when no caption is set), slide counter (`01 / 04`), and full-screen lightbox viewing.
6. **Our Smart Systems (`SmartSystemsSection.tsx`):**
   - Situated directly below *Glimpses of Our School* and above the footer, linking visitors and staff to four integrated school platforms (each opening in a new browser tab):
     - **ReliefMS — Smart Teacher Relief Management System**
     - **Smart School Attendance Management System**
     - **School Marks & Report System**
     - **Automated Digital Bell System**

### Dedicated Public Navigation Tabs
- **Heritage (`HeritageSection.tsx`):** Interactive sub-tabs for **History & Founder** (Est. 1924), **Vision & Mission**, **School Motto**, and **School Anthem** (including an interactive soft chime rhythm player that highlights each stanza in sequence).
- **Academics (`AcademicsSection.tsx`):** Filterable curriculum showcase (**All Levels**, **Primary 1–5**, **Junior Secondary 6–11**, and **GCE A/L Streams**) covering core and elective subjects across Primary, GCE O/L, and GCE A/L Arts, Commerce, and Engineering/Bio-Systems Technology streams.
- **Staff (`StaffSection.tsx`):** Highlights the Principal leadership card followed by the **Academic Faculty Directory**, filterable by **All Faculty**, **Primary**, **Secondary**, and **GCE A/L**. Staff cards render uploaded portraits or clean automatic initials badges.
- **Former Principals (`FormerPrincipalsSection.tsx`):** Honours past principals of the school with service tenure badges, qualifications/notes, optional portraits, and a dignified neutral silhouette fallback when no photograph is attached.
- **Exam Results (`ExamResultsSection.tsx`):**
  - Category filter pills for **All Exams**, **Grade 5 Scholarship (`புலமைப்பரிசில்`)**, **G.C.E. O/L (`க.பொ.த சாதாரண தரம்`)**, and **G.C.E. A/L (`க.பொ.த உயர்தரம்`)**.
  - Year-wise result cards displaying prominent pass percentage badges, optional result summaries, **Top Performers & High Achievers** (with marks/Z-scores/distinctions and optional portraits or silhouette icons), and optional **Result Highlights & Celebrations** photo grids with a lightbox viewer.
- **Notices (`NoticesSection.tsx`):** Searchable notice board filterable by **All Notices**, **Exams**, **Circulars**, and **Events**. Supports pinned notices, official reference codes, a slide-over **Read Full Notice** drawer, and an inline **PDF / Image Attachment Viewer** with direct file download.
- **Honours (`AchievementsSection.tsx`):** Showcases student and team distinctions across **Academic**, **Sports**, and **Co-Curricular** categories with year badges and optional achievement photos.
- **Gallery (`GallerySection.tsx`):** Filterable event chronicle (**All Photos**, **School Grounds**, **Academics**, **Sports**, **Cultural**) supporting **multi-photo event albums** with album photo-count badges and a full-screen multi-image lightbox with thumbnail strip navigation.
- **Contact (`ContactSection.tsx`):** Clean school contact directory (Address, Office Telephone, Official Email, Office Hours) paired with an embedded interactive location map centered on **Manipay, Jaffna**.

---

## 3. Built-in Admin CMS Capabilities

The Admin Portal is accessible via the **Admin Portal** link in the footer (or by navigating directly to `/admin`) and is protected by session authentication (`AdminLogin.tsx`). It is tailored for non-technical school staff:

- **100% Local Device & Phone File Uploads (Zero Image URL Inputs):**
  - Every photo and document upload across the CMS (School Crest, Hero Banner, Principal Portrait, Staff Photos, Former Principal Portraits, School Glimpses, Exam Result Portraits & Celebration Photos, Notice PDF/Image Attachments, Achievement Photos, and Multi-Photo Event Albums) uses native file pickers (`<input type="file" />`).
  - Uploaded images are automatically resized/compressed in-browser via canvas (`readImageFileAsDataUrl`) and stored as local data URLs alongside PDF attachments (`readAttachmentFile`, up to 4 MB) so uploads work smoothly on both desktop and mobile devices.
- **Single-Language Entry with Smart Bilingual Fallback:**
  - Every CMS form accepts **English only**, **Tamil only**, or **both languages** without blocking saves.
  - Public components use `pickText()` and `pickList()` from `src/utils/schoolHelpers.ts` so content entered in a single language renders cleanly regardless of which language a visitor selects, while dynamically switching whenever both translations are provided.
- **Optional Media & Clean Fallbacks:**
  - **School Glimpses:** Captions are strictly optional; uncaptioned slides display clean photography with only the slide counter.
  - **People Profiles (Staff, Former Principals, Exam Top Performers):** Photos are optional, automatically falling back to initials badges (Staff) or neutral user silhouettes (Former Principals & Top Performers).
  - **Achievements:** Photographs are optional; text-only honours render clean editorial cards without broken placeholders.

### Admin CMS Panels (`src/components/admin/`)
1. **General, Crest & Hero (`AdminGeneralPanel.tsx`):** Upload/reset School Crest (with Light Header and Dark Footer previews), update Hero titles/subtitles and banner image, and edit founding details, motto, vision, mission, history, and school anthem stanzas.
2. **Stats, Strength & Principal (`AdminPrincipalStatsPanel.tsx`):** Manage Academic Staff, Non-Academic Staff, and Prefect counts; add/edit/remove classes in the Class-wise Student Strength table (Boys & Girls counts automatically recalculate total Active Students); edit Principal bio, photo, and welcome messages.
3. **Teachers / Staff (`AdminStaffPanel.tsx`):** Full CRUD, section assignment (`Primary`, `Secondary`, `GCE A/L`), photo upload, and up/down reordering.
4. **Former Principals (`AdminFormerPrincipalsPanel.tsx`):** Full CRUD, optional portrait upload, tenure and notes editing, and up/down reordering.
5. **Exam Results (`AdminExamResultsPanel.tsx`):** Create, edit, and delete Scholarship, O/L, and A/L result records; manage nested Top Performers with optional portraits; upload multiple celebration photos per record.
6. **School Glimpses (`AdminHomeGalleryPanel.tsx`):** Upload school surrounding photos, add optional EN/TA captions and dates, and reorder slides for the Home page filmstrip.
7. **Smart Systems (`AdminSmartSystemsPanel.tsx`):** Edit bilingual titles, descriptions, portal URLs, and Home-page visibility toggles (`Visible on Home` / `Hidden`) for the 4 digital school systems.
8. **Notices Manager (`AdminNoticesPanel.tsx`):** Publish, edit, delete, and pin/unpin notices; attach PDF documents or image circulars directly from device storage.
9. **Achievements & Gallery (`AdminAchievementsGalleryPanel.tsx`):** Manage Academic/Sports/Co-Curricular honours (with optional photo upload) and multi-photo Event Gallery albums.
10. **Theme & Brand Studio (`AdminThemeBrandPanel.tsx`):** Apply institutional color presets (*Heritage Crimson & Gold*, *Jaffna Royal Lapis*, *Palmyra Forest & Bronze*, *Academic Slate & Terracotta*), pick custom primary/accent hex colors live, or reset CMS data back to school defaults.

---

## 4. Tech Stack & Project Architecture

### Core Technologies
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with CSS custom properties for live brand theming and class-based Dark mode (`dark`)
- **Animations:** Motion (`motion/react`) for scroll reveals, tab transitions, drawers, lightboxes, and carousels
- **Icons:** Lucide React (`lucide-react`)

### Project Structure
```text
src/
├── App.tsx                             # Public tab router & /admin route switcher
├── main.tsx                            # Application entry point
├── index.css                           # Tailwind CSS v4 setup & editorial typography utilities
├── assets/images/                      # Bundled default crest, hero, lab, sports, cultural & staff photography
├── types/
│   └── school.ts                       # TypeScript interfaces (SchoolData, ExamResultItem, SmartSystemItem, etc.)
├── data/
│   ├── defaultSchoolData.ts            # Bilingual seed dataset for J/Manipay Memorial English School
│   └── uiStrings.ts                    # Complete English & Tamil UI dictionary
├── utils/
│   └── schoolHelpers.ts                # pickText, pickList, cleanBilingual, readImageFileAsDataUrl, readAttachmentFile
├── services/
│   └── schoolService.ts                # localStorage persistence, hydration & sessionStorage admin auth helpers
├── context/
│   └── SchoolDataContext.tsx           # Central state provider, live CSS variable injector & CMS mutation actions
└── components/
    ├── Header.tsx                      # Ticker, crest, single-row bilingual navbar & mobile drawer
    ├── Footer.tsx                      # Quick navigation, school summary & Admin Portal entry
    ├── CommandSearchModal.tsx          # Global Ctrl+K quick search dialog
    ├── SchoolCrest.tsx                 # Theme-protected crest emblem renderer
    ├── SafeImage.tsx                   # Resilient image wrapper with error fallback
    ├── ToastContainer.tsx              # Non-intrusive notification toasts
    ├── HeroSection.tsx                 # Home hero banner
    ├── StatsBar.tsx                    # Live counters & expandable class-wise student strength table
    ├── MottoSpotlight.tsx              # Motto showcase strip
    ├── PrincipalDesk.tsx               # Principal message card with expand/collapse
    ├── HomeGallerySection.tsx          # "Glimpses of Our School" editorial spotlight & filmstrip
    ├── SmartSystemsSection.tsx         # "Our Smart Systems" portal cards on Home view
    ├── HeritageSection.tsx             # History, Vision & Mission, Motto & interactive School Anthem
    ├── AcademicsSection.tsx            # Filterable Primary, Secondary & GCE A/L streams
    ├── StaffSection.tsx                # Principal card & filterable Academic Faculty directory
    ├── FormerPrincipalsSection.tsx     # Past principals tribute grid
    ├── ExamResultsSection.tsx          # Scholarship, O/L & A/L results, top performers & photo lightbox
    ├── NoticesSection.tsx              # Filterable notice board, drawer & inline PDF/image attachment preview
    ├── AchievementsSection.tsx         # Academic, Sports & Co-Curricular honours
    ├── GallerySection.tsx              # Multi-photo event albums & lightbox
    ├── ContactSection.tsx              # School contact cards & Manipay map embed
    └── admin/
        ├── AdminLogin.tsx              # Admin CMS sign-in screen
        ├── AdminPortal.tsx             # Admin dashboard shell & sidebar navigation
        ├── AdminGeneralPanel.tsx       # Crest, Hero & Heritage editor
        ├── AdminPrincipalStatsPanel.tsx# Counters, class strength & Principal editor
        ├── AdminStaffPanel.tsx         # Teachers & faculty manager
        ├── AdminFormerPrincipalsPanel.tsx
        ├── AdminExamResultsPanel.tsx   # Exam results, top performers & celebration photos manager
        ├── AdminHomeGalleryPanel.tsx   # School Glimpses slide manager
        ├── AdminSmartSystemsPanel.tsx  # Smart Systems link & visibility manager
        ├── AdminNoticesPanel.tsx       # Notice & PDF circular manager
        ├── AdminAchievementsGalleryPanel.tsx
        └── AdminThemeBrandPanel.tsx    # Live brand color studio & reset controls
```

### State & Persistence Architecture
- **Centralized Context (`SchoolDataContext.tsx`):** Manages `data` (`SchoolData`), `language` (`'en' | 'ta'`), `themeMode` (`'light' | 'dark'`), active UI strings (`UI_STRINGS[language]`), toast notifications, and all CRUD/reordering actions.
- **Persistence (`schoolService.ts`):**
  - School content, uploaded media data URLs, class strengths, exam results, smart systems, and brand colors are persisted in `localStorage` under `jmmes_school_data_v1` (with safe hydration against `DEFAULT_SCHOOL_DATA` for backward compatibility).
  - Language and theme preferences persist in `localStorage` (`jmmes_lang_v1`, `jmmes_theme_v1`), while admin login state is maintained in `sessionStorage` (`jmmes_admin_session_v1`).
