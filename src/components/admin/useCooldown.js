'use client';

import { useEffect, useState } from 'react';

/**
 * Counts down a rate-limit wait. Both auth endpoints allow 5 attempts per 15 minutes and every
 * retry pushes the window out, so the remaining time is shown on the button rather than left for
 * the user to rediscover.
 *
 * @returns {[setSeconds: (seconds: number) => void, label: string|null]}
 *          `label` is a `m:ss` countdown, or null while idle.
 */
export default function useCooldown() {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;
        const timer = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const label =
        secondsLeft > 0
            ? `Retry in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`
            : null;

    return [setSecondsLeft, label];
}
