import fs from 'fs';
import path from 'path';
import { unzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream } from 'fs';
import { Extract } from 'unzipper';

async function extractZip(src, dst) {
  try {
    await fs.promises.mkdir(dst, { recursive: true });
    await createReadStream(src).pipe(Extract({ path: dst })).promise();
    console.log('Extracted', src, '->', dst);
  } catch (err) {
    console.error('Failed to extract', src, err);
    process.exit(1);
  }
}

(async () => {
  const src = process.argv[2] || path.join(process.cwd(), 'test-results', 'cockpit-Cockpit-Module-—-s-9a5b6-can-add-a-new-profile-stack-chromium', 'trace.zip');
  const dst = process.argv[3] || path.join(process.cwd(), 'test-results', 'trace-unpack');
  console.log('src', src);
  console.log('dst', dst);
  await extractZip(src, dst);
})();
