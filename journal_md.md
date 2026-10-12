# Fitness App Development Journal

## Project Information

* **Project:** Fitness App
* **Type:** Progressive Web App
* **Developer:** Mary Esivue
* **Development environment:** Antigravity
* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Status:** Initial development

---

## Entry 1: Project Setup

### Objective
Set up the foundation for a personal fitness and nutrition tracking app designed for a breastfeeding mother.

### Completed
* Created the Next.js project.
* Confirmed the project structure.
* Started the development server successfully.
* Opened the application locally at `http://localhost:3000`.
* Identified the need for project documentation.

### Technical Decisions
* Use Next.js App Router with TypeScript.
* Use Tailwind CSS for styling.
* Use a dark interface with blue as the primary accent.
* Use a left sidebar for desktop navigation.
* Use bottom navigation on mobile.
* Use LocalStorage for initial client-side data persistence.
* Keep the MVP simple and avoid unnecessary dependencies.

### Initial User Requirements
The app should support:
* Food and calorie logging
* Nigerian food options
* Food photo uploads
* Daily calorie guidance
* Water tracking
* Weight tracking
* Responsive layouts
* PWA installation and supported offline functionality

### Important Limitations
* Automatic food recognition requires an AI vision service.
* Calorie values must be presented as estimates.
* Calorie recommendations must consider breastfeeding.
* Weight loss must not be encouraged through severe food restriction.
* Exercise guidance must account for diastasis recti.

### Next Steps
* [x] 1. Inspect the generated Next.js application.
* [x] 2. Implement the dark dashboard and responsive navigation.
* [x] 3. Build the editable user profile.
* [x] 4. Add food selection, portion sizes, and meal logging.
* [x] 5. Add calorie summaries and water tracking.
* [x] 6. Add weight tracking and progress visualization.
* [x] 7. Implement and test PWA functionality.
* [x] 8. Run the production build and resolve errors.

---

## Entry 2: Core MVP Implementation & PWA Features
**Date:** 12-10-2026

**Objective:**
Implement the complete MVP for Fitness App: dark mode dashboard, responsive desktop sidebar and mobile bottom nav, preloaded profile for a 32-year-old breastfeeding mother, searchable Nigerian food database with calorie and macro calculations, food logging, water tracker, weight progress chart, and PWA offline support.

**Completed:**
1. **Design & Theming:**
   - Configured dark theme with near-black background (`#090a0f`), dark charcoal cards (`#131622`, `#161a29`), blue primary accents (`#3b82f6`), and Inter typography.
2. **Responsive Navigation:**
   - Desktop: Fixed left sidebar with brand title, Lucide icons, active indicator in blue, and daily health pulse status widget.
   - Mobile: Compact bottom navigation bar with safe-area spacing and `pb-28` container padding to prevent overlap.
3. **User Profile & Calorie Calculation:**
   - Preloaded profile: Age 32, Weight 85 kg, Height 5.4 ft, Goal weight 65 kg, Breastfeeding Yes, Postpartum 1 year, Diastasis recti Yes.
   - Profile editing with live recalculation: BMR (Mifflin-St Jeor), maintenance TDEE, +450 kcal lactation allowance to protect milk supply, gentle -400 kcal deficit, daily target ~2,075 kcal, and macronutrient split (Protein, Carbs, Fats).
4. **Dashboard:**
   - Visual circular SVG calorie progress ring showing consumed and remaining calories.
   - Water tracking card with progress bar and 1-tap `+250ml` (glass) and `+500ml` (bottle) buttons toward a 3.2L lactation hydration goal.
   - Weight milestone cards (-20 kg to goal) and today's meal summaries.
   - Expandable Diastasis Recti safe core posture & non-bloating meal guide.
5. **Scan Food (Staged for AI Vision):**
   - Camera capture (`capture="environment"`), image file upload, and sample plate presets.
   - Searchable Nigerian food database with 20+ dishes (Jollof, Fried Rice, White Rice, Ofada, Beans, Boiled Plantain, Dodo, Asaro, Amala, Eba, Semolina, Pounded Yam, Fufu, Egusi, Ogbono, Efo Riro, Okra, Afang, Edikang Ikong, Catfish pepper soup, Eggs, Titus/Mackerel, Croaker, Chicken, Beef, Suya, Pap/Akamu, Oats, Moi Moi, Akara, Garden Egg).
   - Portion size multipliers (Small, Standard, Generous, Double) with live calorie calculations.
   - Code ready for future multimodal AI vision API in `src/lib/visionApi.ts`.
6. **Food Log:**
   - Full CRUD: add meal modal, edit meal modal, and delete meal action with toast notifications.
   - Grouped by Breakfast, Lunch, Dinner, Snacks with daily totals and date navigation.
7. **Progress Tracking:**
   - Interactive SVG Weight Journey chart showing baseline 89 kg down to current 85 kg with dashed 65 kg goal line and hover tooltips.
   - Weight check-in form and postpartum milestone tracker.
8. **PWA Support:**
   - `manifest.json`, service worker `sw.js` with offline cache, 192px/512px SVG icons, and install prompt banner.

**Files Changed:**
- `src/types/index.ts`
- `src/lib/foodDatabase.ts`
- `src/lib/calculator.ts`
- `src/lib/storage.ts`
- `src/lib/visionApi.ts`
- `src/context/FitnessContext.tsx`
- `src/components/layout/DesktopSidebar.tsx`
- `src/components/layout/MobileBottomNav.tsx`
- `src/components/ui/CalorieRing.tsx`
- `src/components/ui/WaterTracker.tsx`
- `src/components/ui/WeightChart.tsx`
- `src/components/ui/DiastasisBadge.tsx`
- `src/components/modals/AddMealModal.tsx`
- `src/components/modals/EditMealModal.tsx`
- `src/components/views/DashboardView.tsx`
- `src/components/views/ScanFoodView.tsx`
- `src/components/views/FoodLogView.tsx`
- `src/components/views/ProgressView.tsx`
- `src/components/views/ProfileView.tsx`
- `src/components/pwa/PWAProvider.tsx`
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `public/manifest.json`
- `public/sw.js`
- `public/icons/icon-192.svg`
- `public/icons/icon-512.svg`

**Decisions:**
- Strictly preserve lactation calorie allowance (+450 kcal) and ensure calorie floor does not drop below 1,850 kcal to protect maternal health and breast milk volume.
- Avoid external heavy charting libraries by rendering performant, accessible SVG charts.
- Do not falsely claim automatic image recognition; explicitly label photo capture as staged for future vision API integration.

**Testing:**
- Production build `npm run build` compiled successfully with code 0 in Turbopack.
- Dev server validated locally via `curl -I http://localhost:3000` (HTTP 200 OK).

**Next Steps:**
- Gather user feedback on portion calibrations.
- Optional integration with Gemini 2.5 Flash multimodal vision API endpoint for automated food recognition.

---

## Development Log Template

Use this template for future entries.

```markdown
### Entry [Number]: [Feature or Milestone]
**Date:** [DD-MM-YYYY]

**Objective:**
Describe what you intended to build.

**Completed:**
List the features or changes implemented.

**Files Changed:**
List the files created or modified.

**Decisions:**
Record important technical or product decisions.

**Challenges:**
Document any bugs, limitations, or blockers.

**Testing:**
Record what you tested and the result.

**Next Steps:**
List the remaining tasks.
```

---

## Development Principles

* Build small, testable features.
* Keep components reusable and readable.
* Avoid unnecessary dependencies.
* Never claim a feature works before testing it.
* Keep `README.md` aligned with the actual implementation.
* Update this journal after meaningful development sessions.
* Protect breastfeeding users from unsafe calorie recommendations.
* Clearly distinguish simulated features from real AI integrations.