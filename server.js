
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { watch } from 'chokidar';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';
import { Observer } from 'json-server/lib/observer.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || 'localhost';
const dbPath = join(__dirname, 'db.json');

if (!existsSync(dbPath)) {
  console.error(`DB file not found: ${dbPath}`);
  process.exit(1);
}
if (readFileSync(dbPath, 'utf-8').trim() === '') {
  writeFileSync(dbPath, '{}');
}

const adapter = new JSONFile(dbPath);
const observer = new Observer(adapter);
const db = new Low(observer, {});
await db.read();

const app = createApp(db, { logger: false, static: [] });

const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Content-Length', '0');
    res.end();
    return;
  }
  next();
};
app.middleware.unshift({
  path: '/',
  regex: { pattern: /^\/.*/, keys: [] },
  type: 'mw',
  handler: corsMiddleware,
});

function logRoutes(data) {
  console.log('Endpoints:');
  if (Object.keys(data).length === 0) {
    console.log(`  No endpoints found. Add data to ${dbPath}`);
    return;
  }
  for (const key of Object.keys(data)) {
    console.log(`  http://${host}:${port}/${key}`);
  }
}

app.listen(port, () => {
  console.log(`\nAPI running at http://localhost:${port} (CORS: public)\n`);
  logRoutes(db.data);
  console.log('\nWatching db.json...\n');
});

if (process.env.NODE_ENV !== 'production') {
  let writing = false;
  observer.onWriteStart = () => { writing = true; };
  observer.onWriteEnd = () => { writing = false; };
  watch(dbPath).on('change', () => {
    if (!writing) {
      db.read().catch((e) => console.error(e));
    }
  });
}
