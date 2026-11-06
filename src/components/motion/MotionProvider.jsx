'use client';

import { LazyMotion, domAnimation } from 'motion/react';

/**
 * One feature bundle for the whole page: `domAnimation` is what `whileInView` needs, and it is roughly
 * half the size of importing `motion` directly. Everything below uses `m.*` from motion/react.
 */
export default function MotionProvider({ children }) {
    return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
