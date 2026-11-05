// Asset rules for public/: raster images are WebP, animated WebP is lossless,
// and every file is listed in docs/assets.md (and vice versa). Pure logic is exported for tests.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';

const FORBIDDEN_RASTER = /\.(gif|png|jpe?g|bmp|tiff?)$/i;

/** Returns the WebP chunk kinds used by animation frames, e.g. ['VP8L'] or ['VP8 ']. */
export function webpAnimationFrameCodecs(buffer) {
  if (buffer.length < 12 || buffer.toString('latin1', 0, 4) !== 'RIFF' || buffer.toString('latin1', 8, 12) !== 'WEBP') {
    return null;
  }
  const codecs = [];
  let animated = false;
  for (let offset = 12; offset + 8 <= buffer.length; ) {
    const id = buffer.toString('latin1', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === 'ANIM') animated = true;
    if (id === 'ANMF') {
      for (let inner = offset + 8 + 16; inner + 8 <= offset + 8 + size; ) {
        const innerId = buffer.toString('latin1', inner, inner + 4);
        const innerSize = buffer.readUInt32LE(inner + 4);
        if (innerId === 'VP8 ' || innerId === 'VP8L') codecs.push(innerId);
        inner += 8 + innerSize + (innerSize % 2);
      }
    }
    offset += 8 + size + (size % 2);
  }
  return animated ? codecs : [];
}

export function evaluate({ files, register, readFile }) {
  const problems = [];
  for (const file of files) {
    if (FORBIDDEN_RASTER.test(file)) {
      problems.push(`${file}: use lossless WebP instead (run: node scripts/to-lossless-webp.mjs ${file}).`);
    }
    if (/\.webp$/i.test(file)) {
      const codecs = webpAnimationFrameCodecs(readFile(file));
      if (codecs === null) problems.push(`${file}: not a valid WebP file.`);
      else if (codecs.includes('VP8 ')) {
        problems.push(`${file}: animated WebP must be lossless (convert from the source GIF with scripts/to-lossless-webp.mjs).`);
      }
    }
    if (!register.includes(`\`${file}\``)) {
      problems.push(`${file}: not listed in docs/assets.md.`);
    }
  }
  const listed = new Set([...register.matchAll(/`(public\/[^`\s]+)`/g)].map((m) => m[1]));
  for (const path of listed) {
    if (!files.includes(path)) problems.push(`${path}: listed in docs/assets.md but the file does not exist.`);
  }
  return problems;
}

function listPublic(dir = 'public') {
  const found = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) found.push(...listPublic(full));
    else if (name !== 'README.md') found.push(posix.normalize(full.replaceAll('\\', '/')));
  }
  return found.sort();
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const problems = evaluate({
    files: existsSync('public') ? listPublic() : [],
    register: readFileSync('docs/assets.md', 'utf8'),
    readFile: (file) => readFileSync(file),
  });
  if (problems.length > 0) {
    console.error('Asset check failed:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('Asset check passed: public/ files are WebP, animations lossless, all registered in docs/assets.md.');
}
