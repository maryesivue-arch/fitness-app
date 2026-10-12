# Fitness App

A personal fitness and nutrition tracking Progressive Web App (PWA) designed for a breastfeeding mother working toward gradual, sustainable weight loss. 

The app focuses on Nigerian foods, calorie awareness, hydration, weight tracking, and simple fitness progress.

## Project Overview

**Goal:** Help users understand their food intake, monitor daily habits, and track weight progress while prioritizing adequate nutrition during breastfeeding.

**Initial user profile:**
*   **Age:** 32
*   **Starting weight:** 85 kg
*   **Goal weight:** 65 kg
*   **Height:** 5.4 ft
*   **Breastfeeding:** Yes
*   **Postpartum:** 1 year
*   **Diastasis recti:** Yes

*(Note: These are initial profile values and must be editable within the app.)*

## Tech Stack

*   Next.js with App Router
*   TypeScript
*   Tailwind CSS
*   Lucide icons
*   LocalStorage for client-side persistence
*   PWA support

## Design System

*   **Theme:** Dark mode by default
*   **Background:** Near black
*   **Surfaces:** Dark charcoal
*   **Primary accent:** Blue
*   **Typography:** Inter
*   **Layout:** Left sidebar on desktop and bottom navigation on mobile
*   **Approach:** Minimal, accessible, responsive, and mobile-first

## Core Features

The MVP is intended to include:

1.  **Dashboard:** Daily calorie summary, weight progress, hydration, and recent meals.
2.  **Food logging:** Upload a food photo, select a Nigerian food, choose a portion, and view estimated calories.
3.  **Meal tracking:** Add, edit, and delete meals.
4.  **Calorie guidance:** Estimate energy needs using profile information, activity level, and breastfeeding status.
5.  **Water tracking:** Record fluid intake and monitor daily progress.
6.  **Weight tracking:** Record weight entries and view progress toward the goal.
7.  **Responsive navigation:** Sidebar on desktop and bottom navigation on mobile.
8.  **PWA support:** Installable experience and offline access to supported application features.

*Features should be marked complete only after implementation and testing.*

## Supported Food Categories

The initial food database should include:
*   Rice
*   Beans
*   Plantain
*   Amala
*   Eba
*   Semolina
*   Pap
*   Oats
*   Eggs
*   Fish
*   Chicken
*   Beef
*   Nigerian soups

*Note: Calorie values are estimates and depend on portion size, ingredients, and preparation method.*

### Food Photo Limitations
The initial MVP allows users to upload a photo and select or confirm the food manually. Automatic food recognition requires a compatible AI vision service and is not assumed to exist in the local implementation.

## Local Development

### Requirements
*   Node.js
*   npm
*   A code editor such as Antigravity (or VS Code)

### Installation
Clone or open the project, then run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually: `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Data and Privacy

The MVP uses LocalStorage for supported user data. Data is stored in the current browser and is not automatically synchronized across devices. 

**Warning:** Do not store sensitive health information unless appropriate privacy and security measures are implemented.

## Health and Safety

**Disclaimer:** The app provides general tracking and educational guidance, not medical diagnosis or treatment.

*   Calorie targets must account for breastfeeding and should not encourage severe restriction or rapid weight loss. 
*   Exercise guidance should account for diastasis recti and advise users to modify movements that cause abdominal doming, pain, pelvic pressure, or other concerning symptoms.

## Current Status

**MVP Functional & Deployed Locally:**
- [x] Responsive layout with fixed desktop sidebar & mobile bottom navigation
- [x] Dark mode default theme with near-black and dark charcoal palette
- [x] Preloaded and editable user profile for breastfeeding mother with Diastasis Recti
- [x] Dashboard with SVG calorie ring, water intake tracker, and weight milestones
- [x] Photo staging and searchable Nigerian food database (rice, swallows, soups, proteins, sides)
- [x] Food log with full CRUD (add, edit, delete meals) and date navigation
- [x] Progress tracking with interactive SVG weight progress chart
- [x] PWA offline support with service worker and manifest

## Future Improvements

*   AI-powered food recognition
*   More accurate portion estimation
*   Expanded Nigerian food database
*   Improved nutrition calculations
*   Optional secure cloud synchronization
*   Enhanced progress visualizations

## License

No license has been specified yet. Add a license before distributing the project as open source.