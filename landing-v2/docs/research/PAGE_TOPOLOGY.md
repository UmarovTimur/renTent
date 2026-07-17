# Page Topology — Quechua SS25 Lookbook

Source: https://quechua-lookbook.com/ss25/ (WordPress theme "gl", Lenis smooth-scroll,
GSAP scroll choreography). Cloned as a **visual + structure** clone: exact layout,
typography, colors, real assets, responsive, hover + fade/slide reveals. Heavy GSAP
parallax/pinning and the animated trail-path choreography are intentionally rendered as
static/decorative per the agreed scope.

## Sections (top → bottom)

| # | Component | Interaction model | Header theme | Notes |
|---|-----------|-------------------|--------------|-------|
| 0 | `Preloader` | time-driven (0→100%) | — | Casey labels + hand-drawn arrows on cream, slides up on complete |
| 1 | `SiteHeader` | scroll-driven | adaptive | Fixed. Left pill swaps Overview→Jackets→Shoes→Backpack; text light/dark per section via `data-header-theme` |
| 2 | `HeroSection` | static + video | dark | Full-bleed `hero-loop.mp4`, "Feel *alive* in *every* footstep", scroll cue, Discover-full-video card (opens modal) |
| 3 | `IntroSection` | reveal on scroll | light | Manifesto H2, indented paragraph, 3 scattered photo cards, decorative dotted trail SVG |
| 4-6 | `Chapter` ×3 (Jacket/Shoes/Backpack) | click + reveal | mixed | Each = Cover → Category divider (huge text + photo cluster) → Product feature (greige panel + MH500/MH900 toggle) → Men/Women outfit showcase (colorway swatches, Buy now) |
| 7 | `CtaSection` | reveal | light | "Unleash your next adventure" + See full collection |
| 8 | `BrandStory` | reveal | dark | "Crafted in the heart of the French Alps", Since 1997, Mountain Lab location |
| 9 | `SiteFooter` | static | dark | "Feel alive in every footstep", Go to Decathlon, socials, legal |

## Layout system
- Container: `.q-container` max-width 90rem, padding 1rem (1.6rem ≥768px)
- Source grid: 16 columns; breakpoints 768 / 1024 / 1200
- Film-grain texture (`/images/grain.jpg`) multiplied over dark sections via `.q-grain`
