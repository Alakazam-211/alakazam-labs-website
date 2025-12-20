# Alakazam Labs Website

A Next.js 16.0.10 website for Alakazam Labs, migrated from React Router to Next.js App Router.

## Features

- ⚡ Next.js 16.0.10 with App Router
- 🎨 Tailwind CSS with custom design system
- ⭐ Integrated ratings package for testimonials
- 📱 Fully responsive design
- 🚀 Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Fillout API credentials:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your Fillout API keys:
   - `FILLOUT_TESTIMONIALS_API_KEY`
   - `FILLOUT_TESTIMONIALS_DB_ID`
   - `FILLOUT_COLLECTIONS_TABLE_ID`
   - `FILLOUT_COLLECTION_TESTIMONIALS_TABLE_ID`
   - `FILLOUT_TESTIMONIALS_TABLE_ID`

### Development

Run the development server on port 3013:

```bash
npm run dev
```

Open [http://localhost:3013](http://localhost:3013) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── book/              # Book session page
│   ├── privacy/           # Privacy policy page
│   ├── solutions/         # Solutions catalog page
│   ├── terms/             # Terms of service page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # UI components (button, card, etc.)
│   └── ...                # Page components
├── ratings-package/       # Ratings and testimonials components
├── lib/                    # Utility functions
└── old-website-files/     # Original React Router files (reference)
```

## Key Changes from React Router

1. **Routing**: Converted from React Router to Next.js App Router
2. **Navigation**: Changed `useNavigate()` to `useRouter()` from `next/navigation`
3. **Links**: Replaced `<a>` tags with Next.js `<Link>` component
4. **SEO**: Moved SEO to Next.js metadata API in layout.tsx
5. **Ratings**: Integrated ratings-package components instead of iframes
6. **Client Components**: Added `'use client'` directive to components using hooks

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to main.

## Environment Variables

All Fillout API configuration is done through environment variables. Make sure to set these in your Vercel project settings:

- `FILLOUT_TESTIMONIALS_API_KEY`
- `FILLOUT_BASE_URL`
- `FILLOUT_TESTIMONIALS_DB_ID`
- `FILLOUT_COLLECTIONS_TABLE_ID`
- `FILLOUT_COLLECTION_TESTIMONIALS_TABLE_ID`
- `FILLOUT_TESTIMONIALS_TABLE_ID`

## Notes

- The ratings package components are located in `ratings-package/components/`
- Testimonials are fetched from Fillout API via `/api/testimonials`
- The Fillout booking form is embedded on `/book` page
- All pages maintain the same design and functionality as the original

