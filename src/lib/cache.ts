// File based cache. Vercel KV is paid; we keep things free by writing to
// /tmp on the serverless runtime. Cache misses fall back to fresh fetches.
//
// Important: /tmp on Vercel is per instance and ephemeral. That is fine for
// our use case (30 minute refresh cycles, ISR for the static pages). We only
// use this to dedupe identical fetches inside one render pass and to persist
// model output across the same instance's lifetime.

import { promises as fs } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = process.env.NODE_ENV === "production" ? "/tmp/nba-cache" : ".cache";

async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

function keyToPath(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  return join(CACHE_DIR, `${safe}.json`);
}

interface Envelope<T> {
  storedAt: number;
  ttlMs: number;
  data: T;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  await ensureDir();
  try {
    const raw = await fs.readFile(keyToPath(key), "utf8");
    const env = JSON.parse(raw) as Envelope<T>;
    if (Date.now() - env.storedAt > env.ttlMs) {
      return null;
    }
    return env.data;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, data: T, ttlMs: number): Promise<void> {
  await ensureDir();
  const env: Envelope<T> = { storedAt: Date.now(), ttlMs, data };
  try {
    await fs.writeFile(keyToPath(key), JSON.stringify(env));
  } catch {
    // best effort
  }
}

export async function cacheWrap<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const hit = await cacheGet<T>(key);
  if (hit !== null) return hit;
  const fresh = await loader();
  await cacheSet(key, fresh, ttlMs);
  return fresh;
}
