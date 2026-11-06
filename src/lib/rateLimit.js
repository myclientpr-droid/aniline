/**
 * Minimal in-memory rate limiter.
 *
 * Not distributed — each server instance has its own bucket. Adequate for a
 * small production site. Swap for Redis/Upstash if horizontal scaling is added.
 */

const buckets = new Map();

/**
 * @param {string} key - Identifies the caller (e.g. `ip:1.2.3.4` or `email:x@y.z`)
 * @param {object} [opts]
 * @param {number} [opts.limit=5] - Max requests allowed per window
 * @param {number} [opts.windowMs=60_000] - Window size in ms
 * @returns {{ ok: true } | { ok: false, retryAfter: number }}
 */
export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now >= entry.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true };
    }

    if (entry.count >= limit) {
        return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    return { ok: true };
}

// Periodically clear stale buckets so the Map doesn't grow forever.
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [k, v] of buckets.entries()) {
            if (now >= v.resetAt) buckets.delete(k);
        }
    }, 5 * 60_000).unref?.();
}