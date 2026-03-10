## Ala Arab Portfolio

This repo contains the portfolio site for Ala Arab. It is a Next.js site using the pages router and a content-first structure so projects and experience can be updated without reworking the layout.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main Files

- `src/pages/index.js`: homepage layout
- `src/pages/resume.js`: resume page
- `src/data/siteContent.js`: content for hero text, project cards, experience, education, and contact links
- `src/styles/Portfolio.module.css`: portfolio-specific styling
- `src/styles/globals.css`: global theme variables and base styles

## Verification

```bash
npm run lint
npm run build
```

## Content Updates

To start adding real projects, edit the `projectCards` array in `src/data/siteContent.js`. Replace the placeholder cards with real titles, summaries, stack details, and links.
