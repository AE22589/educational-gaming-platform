import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, webpAnimationFrameCodecs } from './check-assets.mjs';

function chunk(id, data) {
  const head = Buffer.alloc(8);
  head.write(id, 0, 'latin1');
  head.writeUInt32LE(data.length, 4);
  return Buffer.concat([head, data, data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)]);
}
function webp(...chunks) {
  const body = Buffer.concat([Buffer.from('WEBP', 'latin1'), ...chunks]);
  const head = Buffer.alloc(8);
  head.write('RIFF', 0, 'latin1');
  head.writeUInt32LE(body.length, 4);
  return Buffer.concat([head, body]);
}
const frame = (codec) => chunk('ANMF', Buffer.concat([Buffer.alloc(16), chunk(codec, Buffer.from([1, 2, 3, 4]))]));
const animated = (codec) => webp(chunk('VP8X', Buffer.alloc(10)), chunk('ANIM', Buffer.alloc(6)), frame(codec));
const staticLossy = webp(chunk('VP8 ', Buffer.from([1, 2, 3, 4])));

test('detects animation frame codecs', () => {
  assert.deepEqual(webpAnimationFrameCodecs(animated('VP8L')), ['VP8L']);
  assert.deepEqual(webpAnimationFrameCodecs(animated('VP8 ')), ['VP8 ']);
  assert.deepEqual(webpAnimationFrameCodecs(staticLossy), []);
  assert.equal(webpAnimationFrameCodecs(Buffer.from('nope')), null);
});

const register = '`public/a/ok.webp` `public/a/anim.webp`';
const read = (file) => ({ 'public/a/ok.webp': staticLossy, 'public/a/anim.webp': animated('VP8L'), 'public/a/lossy-anim.webp': animated('VP8 ') })[file] ?? Buffer.alloc(0);

test('accepts WebP files that are registered', () => {
  assert.deepEqual(evaluate({ files: ['public/a/ok.webp', 'public/a/anim.webp'], register, readFile: read }), []);
});
test('rejects gif, png and jpeg files', () => {
  for (const ext of ['gif', 'png', 'jpg', 'jpeg']) {
    const file = `public/a/x.${ext}`;
    const problems = evaluate({ files: [file], register: `\`${file}\``, readFile: read });
    assert.match(problems.join(' '), /lossless WebP/);
  }
});
test('rejects lossy animated WebP', () => {
  const problems = evaluate({ files: ['public/a/lossy-anim.webp'], register: '`public/a/lossy-anim.webp`', readFile: read });
  assert.match(problems.join(' '), /animated WebP must be lossless/);
});
test('rejects unregistered files and registered files that do not exist', () => {
  const unregistered = evaluate({ files: ['public/a/ok.webp'], register: '', readFile: read });
  assert.match(unregistered.join(' '), /not listed in docs\/assets\.md/);
  const missing = evaluate({ files: [], register: '`public/a/gone.webp`', readFile: read });
  assert.match(missing.join(' '), /does not exist/);
});
