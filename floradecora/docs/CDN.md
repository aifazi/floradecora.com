# CDN — cdn.aifazi.net (Cloudflare R2 bucket floradecora)

All media served from `https://cdn.aifazi.net/media/assest/` via R2.
Images use `unoptimized` (original quality) — upload high-res JPG 2400px, already compressed.

## Upload real photography

```bash
# install wrangler
npm i -g wrangler
wrangler login
# upload — keep original filename, encode spaces
wrangler r2 object put floradecora/media/assest/Picture5-real.jpg --file=./local.jpg --remote
# verify
wrangler r2 object list floradecora --prefix media/assest --remote | head
```

## Naming
- Real: `al-ain-park-2023-01.jpg`, `abu-dhabi-nursery-02.jpg` (kebab-case, no spaces/commas)
- Concepts keep `ChatGPT Image ...` but will be phased out — do not add new AI names.

## Replace AI renders
1. Shoot / collect high-res (iPhone 14+ ok, 3000px wide)
2. Compress locally: `npm run optimize-images` (creates .webp 85% for public fallback) but upload original JPG to R2
3. Update `lib/projects.ts` — change `img: cdnMedia("new-file.jpg")`, set `built: true`, add to `gallery`

## Cloudflare optimization (optional)
Enable Polish + Image Resizing on cdn.aifazi.net to auto-WebP:
- Cloudflare Dashboard → Speed → Optimization → Polish: Lossless + WebP
- Or use `cdnMedia(file, {w: 800, q: 80})` helper which appends `?width=&quality=` if Resizing enabled.
