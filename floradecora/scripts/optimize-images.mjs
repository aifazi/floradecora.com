import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const SRC = "public/images";
const QUALITY = 75;

async function run() {
  const files = await readdir(SRC);
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (![".png",".jpg",".jpeg"].includes(ext)) continue;
    const full = join(SRC, f);
    const s = await stat(full);
    if (s.size < 300*1024) { console.log(`skip ${f} ${(s.size/1024).toFixed(0)}KB`); continue; }
    const base = basename(f, ext);
    const out = join(SRC, `${base}.webp`);
    try {
      await sharp(full).webp({ quality: QUALITY }).toFile(out);
      const outStat = await stat(out);
      console.log(`${f} ${(s.size/1024).toFixed(0)}KB -> ${base}.webp ${(outStat.size/1024).toFixed(0)}KB saved ${((1-outStat.size/s.size)*100).toFixed(0)}%`);
    } catch(e){ console.error(f, e.message)}
  }
}
run();