import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, '../../../data/uploads');

export function ensureUploadDir(): string {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  return UPLOAD_DIR;
}

export function storeUpload(buffer: Buffer, filename: string): string {
  const dir = ensureUploadDir();
  const safe = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const dest = path.join(dir, `${Date.now()}_${safe}`);
  fs.writeFileSync(dest, buffer);
  return dest;
}

export function readUpload(filePath: string): Buffer {
  return fs.readFileSync(filePath);
}
