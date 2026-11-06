/**
 * JS mirrors of the motion tokens in src/app/globals.css `@theme` (--ease-cinematic, --duration-*).
 * Keep the two in sync so animated and CSS-transitioned elements share one feel.
 */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1];

export const DUR = {
    fast: 0.15,
    base: 0.25,
    slow: 0.45,
};

export const REVEAL_OFFSET = 16;
export const STAGGER_STEP = 0.06;
