# Mixtape Era - E-commerce Website

A professional e-commerce website for a sticker business built with Next.js 14 and Tailwind CSS.

## Features

- **Neo-Brutalism Lite Design**: Thick black borders, rounded corners, and retro colors
- **Brand Colors**: Custom color palette (cream, red, yellow, green, black)
- **Responsive Design**: Mobile-first approach with clean, maintainable code
- **Components**: Navbar, ProductCard, and Marquee components
- **Landing Page**: Hero section, featured products grid, and fan club signup

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Space Grotesk (Display), JetBrains Mono (Body)

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with fonts
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/
│   ├── Navbar.tsx      # Sticky navigation
│   ├── ProductCard.tsx # Product card component
│   └── Marquee.tsx     # Scrolling banner
└── tailwind.config.ts  # Tailwind configuration with brand colors
```

## Brand Colors

- `brand-cream`: #F3EFDE (Background)
- `brand-red`: #EB7A65 (Primary CTAs)
- `brand-yellow`: #F6CC65 (Badges/Highlights)
- `brand-green`: #538D66 (Success states)
- `brand-black`: #0F0F0F (Text/Borders)

## Build

```bash
npm run build
```

## License

All rights reserved.

