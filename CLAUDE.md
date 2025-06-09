# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Nuxt.js 3 application that provides a unified platform for Japanese furusato nouzei (hometown tax) services. The application aggregates products from 20+ different furusato nouzei platforms and provides AI-powered personalized recommendations to users.

## Architecture

### Frontend Stack
- **Nuxt.js 3** with Vue 3 Composition API
- **TypeScript** for type safety (with some simplified typing for build compatibility)
- **Tailwind CSS** + **Nuxt UI** for styling and components
- **Client-side only** (`ssr: false`) for GitHub Pages compatibility

### Data Management
- **SQL.js** for client-side SQLite database
- **localStorage** for user preferences and session data
- No server-side backend required

### Key Features
1. **Product Aggregation** - Simulates 20+ furusato nouzei services with mock data
2. **AI Recommendations** - Daily personalized 3-product suggestions
3. **Spending Analysis** - Categorizes purchases as consumption/waste/investment
4. **LINE LIFF Integration** - Works as LINE mini-app
5. **Search & Filtering** - Advanced product discovery with categories and price ranges

## Common Development Tasks

### Local Development
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run generate    # Generate static files for GitHub Pages
npm run deploy      # Deploy to GitHub Pages
```

### Testing
- Build process: `npm run build`
- Static generation: `npm run generate`
- No specific test framework configured

## Project Structure

```
/
├── components/          # Vue components
│   ├── ProductCard.vue     # Product display card
│   ├── CategoryBadge.vue   # Category indicator
│   ├── SpendingTypeBadge.vue # Spending type indicator
│   └── RecommendationList.vue # Daily recommendations
├── composables/         # Vue composables (business logic)
│   ├── useDatabase.ts      # SQLite database management
│   ├── useProducts.ts      # Product data handling
│   ├── useRecommendations.ts # AI recommendation engine
│   └── useLiff.ts          # LINE LIFF integration
├── pages/              # Nuxt pages (file-based routing)
│   ├── index.vue          # Homepage with recommendations
│   ├── products/index.vue # Product search and browsing
│   └── history/index.vue  # Recommendation history
├── types/              # TypeScript type definitions
└── plugins/            # Nuxt plugins for initialization
```

## Database Schema

The SQLite database includes these tables:
- `products` - Product catalog from multiple services
- `user_actions` - User interaction tracking
- `recommendations` - Daily recommendation history
- `user_preferences` - User settings and preferences

## Deployment

- **Target**: GitHub Pages
- **Build**: Static site generation with `nuxt generate`
- **Automation**: GitHub Actions workflow in `.github/workflows/deploy.yml`
- **Base Path**: `/kanoyama-kanokawa/` for GitHub Pages

## Important Notes

- Uses simplified TypeScript syntax (no interfaces in components) for build compatibility
- All data processing happens client-side
- Mock data simulates real furusato nouzei services
- LINE LIFF integration includes fallback for non-LINE environments