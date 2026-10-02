#!/usr/bin/env bash
# Downloads all assets for the Quechua SS25 Lookbook clone from the live site.
# Organizes them into clean, predictable paths under public/.
set -uo pipefail
BASE="https://quechua-lookbook.com/ss25/wp-content"
THEME="$BASE/themes/gl/public"
UP="$BASE/uploads"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

dl() { # dl <url> <dest-relative-to-public>
  local url="$1" dest="$ROOT/public/$2"
  mkdir -p "$(dirname "$dest")"
  if curl -sfL "$url" -o "$dest"; then echo "ok   $2"; else echo "FAIL $2 <- $url"; fi
}

# ---------- Fonts ----------
dl "$THEME/fonts/Casey-Regular.80d114.woff2"            fonts/Casey-Regular.woff2
dl "$THEME/fonts/Casey-Regular.4975eb.woff"            fonts/Casey-Regular.woff
dl "$THEME/fonts/Decathlon-Brand-Medium.0bf884.woff2"  fonts/Decathlon-Brand-Medium.woff2
dl "$THEME/fonts/Decathlon-Display-Regular.479aad.woff2" fonts/Decathlon-Display-Regular.woff2
dl "$THEME/fonts/Decathlon-Display-Medium.1b6b40.woff2"  fonts/Decathlon-Display-Medium.woff2
dl "$THEME/fonts/Decathlon-Text-Regular.c392d7.woff2"    fonts/Decathlon-Text-Regular.woff2

# ---------- Textures / global ----------
dl "$THEME/images/grain.74e180.jpg" images/grain.jpg

# ---------- SEO / favicons ----------
dl "$THEME/images/favicon/favicon-32x32.9f4148.png"        seo/favicon-32x32.png
dl "$THEME/images/favicon/favicon-16x16.9b28c9.png"        seo/favicon-16x16.png
dl "$THEME/images/favicon/apple-touch-icon-180x180.9ca195.png" seo/apple-touch-icon.png
dl "$THEME/images/favicon/android-chrome-192x192.b76ce8.png"   seo/android-chrome-192x192.png
dl "$THEME/images/favicon/android-chrome-512x512.dc3e36.png"   seo/android-chrome-512x512.png
dl "$UP/2025/03/og.jpg" seo/og.jpg

# ---------- Videos ----------
dl "$UP/2025/01/loop-2.mp4"              videos/hero-loop.mp4
dl "$UP/2025/02/QUECHUAVF1.mp4"          videos/full-video.mp4
dl "$UP/2025/03/Jacket-01_compressed.mp4" videos/jacket-01.mp4
dl "$UP/2025/03/Jacket-02_compressed.mp4" videos/jacket-02.mp4
dl "$UP/2025/03/Shoes-01_compressed.mp4"  videos/shoes-01.mp4
dl "$UP/2025/03/Shoes-02_compressed.mp4"  videos/shoes-02.mp4
dl "$UP/2025/03/SAD-01_compressed.mp4"    videos/backpack-01.mp4
dl "$UP/2025/03/SAD-02_compressed.mp4"    videos/backpack-02.mp4

# ---------- Preloader ----------
for n in 01 02 03 04; do dl "$UP/2025/02/Loader-$n.jpg" images/loader/loader-$n.jpg; done

# ---------- Intro trail photo cards ----------
dl "$UP/2025/02/picture.jpg"      images/intro/card-1.jpg
dl "$UP/2025/02/picture-_1_.jpg"  images/intro/card-2.jpg
dl "$UP/2025/02/picture-_2_.jpg"  images/intro/card-3.jpg
dl "$UP/2025/02/picture-_3_.jpg"  images/intro/card-4.jpg
dl "$UP/2025/02/picture-_4_-1.jpg" images/intro/card-5.jpg
dl "$UP/2025/02/picture-_5_.jpg"  images/intro/card-6.jpg
dl "$UP/2025/02/picture-_7_.jpg"  images/intro/card-7.jpg
dl "$UP/2025/01/Image-tracking-1.jpg" images/intro/tracking.jpg
dl "$UP/2025/01/2024_10_09_MANONGUENOT_QUECHUA_DSC06005.jpg" images/intro/wide.jpg

# ---------- Jacket chapter ----------
dl "$UP/2025/02/Background-1.jpg"                    images/jacket/chapter-bg.jpg
dl "$UP/2025/02/Jacket-Intersection-Background-V2.jpg" images/jacket/intersection-bg.jpg
dl "$UP/2025/02/Jacket-Intersection-PNG-V2.png"     images/jacket/intersection.png
dl "$UP/2025/02/Background-Jacket-Men.jpg"          images/jacket/bg-men.jpg
dl "$UP/2025/02/Background-Jacket-Women.jpg"        images/jacket/bg-women.jpg
dl "$UP/2025/02/MH500noire.jpg"                     images/jacket/mh500-black.jpg
dl "$UP/2025/02/Jacket-MH900-Black-Packshot.jpg"   images/jacket/mh900-black.jpg
dl "$UP/2025/02/Jacket-MH900-Women-Packshot.jpg"   images/jacket/mh900-women.jpg
dl "$UP/2025/03/Panoplie-PNG-V2-1.png"             images/jacket/panoplie.png
dl "$UP/2025/02/Menu-Jacket.png"                   images/jacket/menu.png
dl "$UP/2025/03/Mh900-Jacket.svg"                  images/drawings/mh900-jacket.svg
dl "$UP/2025/03/MH500-Drawing.svg"                 images/drawings/mh500-jacket.svg

# ---------- Shoes chapter ----------
dl "$UP/2025/02/shoes.jpg"                            images/shoes/chapter-bg.jpg
dl "$UP/2025/02/Shoes-Intersection-Background-V2-2.jpg" images/shoes/intersection-bg.jpg
dl "$UP/2025/02/Shoes-Intersection-PNG-V2-3.png"     images/shoes/intersection.png
dl "$UP/2025/02/Background-Men-Shoes.jpg"            images/shoes/bg-men.jpg
dl "$UP/2025/02/Background-Women-Shoes.jpg"          images/shoes/bg-women.jpg
dl "$UP/2025/02/Shoes-LE-PNG-4.png"                 images/shoes/le.png
dl "$UP/2025/03/Shoes-features-1.png"               images/shoes/features.png
dl "$UP/2025/02/shoes-menu-3.png"                   images/shoes/menu.png
dl "$UP/2025/03/Shoes-Drawing.svg"                  images/drawings/shoes.svg
dl "$UP/2025/03/8912955_004.jpg"                    images/shoes/detail-1.jpg
dl "$UP/2025/03/8917987_002.jpg"                    images/shoes/detail-2.jpg

# ---------- Backpack chapter ----------
dl "$UP/2025/02/Background-Backpack.jpg" images/backpack/chapter-bg.jpg
dl "$UP/2025/02/Background-PNG-2.png"    images/backpack/intersection.png
dl "$UP/2025/02/25L-Backpack-1.png"      images/backpack/25l.png
dl "$UP/2025/02/38L-Backpack-1.png"      images/backpack/38l.png
dl "$UP/2025/02/MH500-25L.jpg"           images/backpack/bg-25l.jpg
dl "$UP/2025/02/MH500-38L.jpg"           images/backpack/bg-38l.jpg
dl "$UP/2025/02/Menu-Backpack.png"       images/backpack/menu.png
dl "$UP/2025/03/B25L-Drawing.svg"        images/drawings/backpack-25l.svg
dl "$UP/2025/03/B38L-Drawing.svg"        images/drawings/backpack-38l.svg

# ---------- CTA / Brand / Footer ----------
dl "$UP/2025/02/Image-Footer.png" images/footer.png
dl "$UP/2025/04/image-cover.jpg"  images/cover.jpg
dl "$UP/2025/02/Versatility.jpg"  images/versatility.jpg

# ---------- Product carousel PNGs (4-frame sets) ----------
declare -A PROD=(
  [jacket/men/default/jacket-men-default-01]=686f61 [jacket/men/default/jacket-men-default-02]=a10d0c
  [jacket/men/default/jacket-men-default-03]=f59060 [jacket/men/default/jacket-men-default-04]=d5ba39
  [jacket/men/variant/jacket-men-variant-01]=ef2034 [jacket/men/variant/jacket-men-variant-02]=7b9401
  [jacket/men/variant/jacket-men-variant-03]=bf3709 [jacket/men/variant/jacket-men-variant-04]=2c8f6e
  [jacket/women/default/jacket-women-default-01]=63c339 [jacket/women/default/jacket-women-default-02]=b7df74
  [jacket/women/default/jacket-women-default-03]=1b552b [jacket/women/default/jacket-women-default-04]=410195
  [jacket/women/variant/jacket-women-variant-01]=1dd3fb [jacket/women/variant/jacket-women-variant-02]=8e8982
  [jacket/women/variant/jacket-women-variant-03]=df1e38 [jacket/women/variant/jacket-women-variant-04]=1d6d56
  [shoes/men/default/shoes-men-default-01]=0326cf [shoes/men/default/shoes-men-default-02]=8ac6fc
  [shoes/men/default/shoes-men-default-03]=ee8a2a [shoes/men/default/shoes-men-default-04]=91012c
  [shoes/women/default/shoes-women-default-01]=ca6904 [shoes/women/default/shoes-women-default-02]=2b8cb2
  [shoes/women/default/shoes-women-default-03]=78a234 [shoes/women/default/shoes-women-default-04]=1cbd4b
  [backpack/men/default/backpack-men-default-01]=889046 [backpack/men/default/backpack-men-default-02]=56c408
  [backpack/men/default/backpack-men-default-03]=9b47ec [backpack/men/default/backpack-men-default-04]=4ecb53
  [backpack/men/variant/backpack-men-variant-01]=6d4d3a [backpack/men/variant/backpack-men-variant-02]=995fb8
  [backpack/men/variant/backpack-men-variant-03]=18377d [backpack/men/variant/backpack-men-variant-04]=88b6cc
)
for path in "${!PROD[@]}"; do
  dl "$THEME/images/products/$path.${PROD[$path]}.png" "images/products/$path.png"
done

echo "=== DONE ==="
