'use client';

import { useEffect, useRef } from 'react';

// `body` has `overflow-x: hidden`, so an over-tilted last-column card is clipped rather than
// merely offset. 4° is the most this can ask for without the edges getting eaten.
const MAX_TILT = 4;
const REST = { '--tilt-x': '0deg', '--tilt-y': '0deg', '--spec-x': '50%', '--spec-y': '34%' };

const clamp = (value) => (value < -0.5 ? -0.5 : value > 0.5 ? 0.5 : value);

/**
 * Pointer-driven card tilt for a whole grid, driven through CSS custom properties.
 *
 * One delegated listener serves every card and writes no React state, so hovering never
 * re-renders. This is deliberately not `TiltCard`: wrapping N cards in N Motion components
 * would compose a second transform against the cards' own and cost a re-render per card.
 *
 * Mounted only on routes that already ship client JS (`/work`, `/clients`, `/photography`).
 * On the zero-JS routes the cards lift on a fixed CSS dolly instead — same verb, no bytes.
 *
 * @param {{ children: import('react').ReactNode, className?: string }} props
 */
export default function TiltField({ children, className = '' }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        // Gated here as well as in CSS: attaching the listener to a touch or reduced-motion
        // device would burn handler time on an effect the stylesheet refuses to draw.
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        let active = null;
        let queued = null;
        let frame = 0;

        const settle = (card) => {
            for (const [name, value] of Object.entries(REST)) card.style.setProperty(name, value);
            card.classList.remove('is-tilting');
        };

        const flush = () => {
            frame = 0;
            if (!queued) return;

            const { card, x, y } = queued;
            queued = null;

            // rotateX is driven by the vertical offset and rotateY by the horizontal one;
            // the signs put the edge nearest the pointer further from the viewer.
            card.style.setProperty('--tilt-x', `${(-y * MAX_TILT).toFixed(3)}deg`);
            card.style.setProperty('--tilt-y', `${(x * MAX_TILT).toFixed(3)}deg`);
            card.style.setProperty('--spec-x', `${((x + 0.5) * 100).toFixed(1)}%`);
            card.style.setProperty('--spec-y', `${((y + 0.5) * 100).toFixed(1)}%`);
        };

        const onPointerMove = (event) => {
            if (event.pointerType !== 'mouse') return;

            // Read the target and its box synchronously. React nulls `currentTarget` when the
            // handler returns, and a rect fetched a frame later is a frame out of date.
            const card = event.target instanceof Element ? event.target.closest('[data-tilt]') : null;
            if (!card) return;

            if (card !== active) {
                if (active) settle(active);
                active = card;
                card.classList.add('is-tilting');
            }

            const box = card.getBoundingClientRect();
            if (!box.width || !box.height) return;

            // Descendants painted outside the wrapper's box still bubble their moves here,
            // which would push the normalised ratio past ±0.5 and whip the tilt around.
            queued = {
                card,
                x: clamp((event.clientX - box.left) / box.width - 0.5),
                y: clamp((event.clientY - box.top) / box.height - 0.5),
            };

            if (!frame) frame = requestAnimationFrame(flush);
        };

        // Crossing between two cards fires no `pointerleave` on the wrapper, so without the
        // `card !== active` handoff above the first card would stay tilted under the second.
        const release = () => {
            if (active) settle(active);
            active = null;
            queued = null;
            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        };

        root.addEventListener('pointermove', onPointerMove, { passive: true });
        root.addEventListener('pointerleave', release);
        root.addEventListener('pointercancel', release);
        window.addEventListener('blur', release);
        document.addEventListener('visibilitychange', release);

        return () => {
            release();
            root.removeEventListener('pointermove', onPointerMove);
            root.removeEventListener('pointerleave', release);
            root.removeEventListener('pointercancel', release);
            window.removeEventListener('blur', release);
            document.removeEventListener('visibilitychange', release);
        };
    }, []);

    return (
        <div ref={rootRef} className={className}>
            {children}
        </div>
    );
}
