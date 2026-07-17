# Design Tokens — Quechua SS25 Lookbook

## Colors
| Token | Value | Use |
|-------|-------|-----|
| Cream | `#f5f4ef` (rgb 245,244,239) | Light section bg, text over dark |
| Charcoal | `#2a2928` (rgb 42,41,40) | Text, dark section bg |
| Greige | `#dcd7ce` | Product-feature panel bg |
| Blue | `#0000ff` | Accent / hover fill |
| Black / White | `#000` / `#fff` | Utility |

## Fonts (self-hosted woff2 in `/public/fonts`, `@font-face` in globals.css)
| Family | Weights | Role |
|--------|---------|------|
| Decathlon Brand | 500 | Hero + chapter-cover headlines (`font-brand`) |
| Decathlon Display | 400/500 | Display headings + body (`font-display`, default sans) |
| Decathlon Text | 400 | Small body paragraphs (`font-text`) |
| Casey | 400 | Handwritten labels / captions (`.q-hand`) |

## Type scale (desktop, effective px)
- Hero / cover headline: ~146px Decathlon Brand
- Category divider ("MH500 Jacket"): ~120px Display Medium
- Brand-story statement: ~90px Display Medium
- Manifesto / section heads: ~58px Display Medium
- Body: ~21px Decathlon Text, line-height 1.3

Implemented with `clamp()` for fluid scaling.

## Easing (from source)
- ease-in `cubic-bezier(0.12,0,0.39,0)`
- ease-out `cubic-bezier(0.19,1,0.22,1)`
- ease-in-out `cubic-bezier(0.86,0,0.07,1)`
- ease-out-back `cubic-bezier(0.175,0.885,0.32,1.275)`

## Radius
Cards/covers ~1rem–2rem; greige panel 2rem; buttons full pill.
