// Converts a PNG, GIF or JPEG into a lossless WebP (animated for GIF). Requires ffmpeg on PATH.
// Usage: node scripts/to-lossless-webp.mjs <input> [output.webp]
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';

const [input, requested] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node scripts/to-lossless-webp.mjs <input.png|gif|jpg> [output.webp]');
  process.exit(2);
}
const ext = extname(input).toLowerCase();
const output = requested ?? input.slice(0, -ext.length) + '.webp';
const common = ['-v', 'error', '-y', '-i', input, '-pix_fmt', 'bgra', '-lossless', '1', '-quality', '100', '-compression_level', '6'];

let args;
if (ext === '.gif') {
  // Keep the GIF's playback: a NETSCAPE loop extension loops (0 = forever); without it the GIF plays once.
  const gif = readFileSync(input);
  const marker = gif.indexOf('NETSCAPE2.0', 0, 'latin1');
  const loop = marker < 0 ? 1 : gif.readUInt16LE(marker + 13);
  args = [...common, '-c:v', 'libwebp_anim', '-loop', String(loop), output];
} else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
  args = [...common, '-c:v', 'libwebp', output];
} else {
  console.error(`Unsupported input type ${ext}.`);
  process.exit(2);
}

try {
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
} catch {
  console.error('ffmpeg failed or is not installed. Install ffmpeg and retry.');
  process.exit(1);
}
const kb = (file) => Math.round(statSync(file).size / 1024);
console.log(`${input} (${kb(input)} KB) -> ${output} (${kb(output)} KB). Register it in docs/assets.md and remove the original.`);
