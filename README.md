# Spotynet

Landing page for a software development company. Built with **Next.js** (React), **TypeScript**, and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout & metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── layout/          # Header, Footer, etc.
│   └── ui/              # Reusable UI (Button, etc.)
├── sections/            # Landing page sections (Hero, Features, CTA, …)
├── lib/                 # Utilities (e.g. utils.ts)
└── types/               # Shared TypeScript types
```

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
