const path = require('path');
const jsQR = require('jsqr');
const { Jimp } = require('jimp');

async function main() {
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error('Usage: node scripts/decode-qris.js <path-to-qris-image>');
    process.exitCode = 1;
    return;
  }

  const resolvedPath = path.resolve(imagePath);
  const image = await Jimp.read(resolvedPath);
  const { data, width, height } = image.bitmap;

  const result = jsQR(new Uint8ClampedArray(data), width, height);

  if (!result) {
    console.error('Could not detect a QR code in that image. Try a clearer/bigger screenshot.');
    process.exitCode = 1;
    return;
  }

  console.log('\nDecoded QRIS string:\n');
  console.log(result.data);
  console.log('\nCopy the text above into your .env as QRIS_STATIC_STRING=<text> (no quotes).');
}

main().catch((error) => {
  console.error('Failed to decode image:', error.message);
  process.exitCode = 1;
});
