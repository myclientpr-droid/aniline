'use client';

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

const SPRING = { stiffness: 170, damping: 18, mass: 0.4 };

/**
 * Pointer-driven perspective tilt. Motion values only — nothing re-renders while the pointer moves.
 * Handlers no-op for reduced-motion users so the SSR markup and the hydrated tree stay identical.
 *
 * @param {{ children: import('react').ReactNode, maxTilt?: number, className?: string }} props
 */
export default function TiltCard({ children, maxTilt = 5, className = '' }) {
    const reduce = useReducedMotion();
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, SPRING);
    const sy = useSpring(py, SPRING);
    const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);

    const onPointerMove = (event) => {
        if (reduce) return;
        const box = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - box.left) / box.width - 0.5);
        py.set((event.clientY - box.top) / box.height - 0.5);
    };

    const onPointerLeave = () => {
        px.set(0);
        py.set(0);
    };

    return (
        <m.div
            className={className}
            style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            {children}
        </m.div>
    );
}
