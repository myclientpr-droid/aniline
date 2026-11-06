'use client';

import { m, useInView } from 'motion/react';
import { useRef } from 'react';
import { DUR, EASE_CINEMATIC, REVEAL_OFFSET } from '@/lib/motionPresets';

const HIDDEN = { opacity: 0, y: REVEAL_OFFSET };
const VISIBLE = { opacity: 1, y: 0 };

/**
 * One-time reveal for server-rendered children. Uses `useInView` rather than `whileInView` because the
 * `domAnimation` LazyMotion bundle does not register the inView feature — `whileInView` would silently
 * never fire. Reduced-motion users are neutralized in CSS (`.reveal` override), so the markup stays
 * identical on server and client.
 *
 * @param {{ children: import('react').ReactNode, delay?: number, className?: string }} props
 */
export default function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, {
        once: true,
        amount: 0.15,
        margin: '0px 0px -10% 0px',
    });

    return (
        <m.div
            ref={ref}
            className={`reveal ${className}`.trim()}
            initial={HIDDEN}
            animate={inView ? VISIBLE : HIDDEN}
            transition={{ duration: DUR.slow, ease: EASE_CINEMATIC, delay }}
        >
            {children}
        </m.div>
    );
}
