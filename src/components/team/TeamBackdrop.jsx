'use client';

// three.js drives a scene by mutating uniforms each frame — that is the R3F API surface, not React
// state. The React Compiler's immutability rule cannot express that.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, Vector2 } from 'three';
import { BACKDROP_FRAGMENT_SHADER, BACKDROP_VERTEX_SHADER } from './teamBackdropShaders';

// A mesh gradient wants only a few thousand shaded pixels; dpr 2 would quadruple the fragment work
// for detail nobody can see.
const DPR_LIMITS = {
    lite: [1, 1],
    full: [1, 1.5],
};

/** Lives inside the Canvas: only R3F descendants may call useFrame. */
function BackdropPlane({ variant, palette, pointer, target }) {
    // Variant 0–3 selects a different permutation of the same field, so no two cards drift alike.
    const v = ((variant % 4) + 4) % 4;
    const uniforms = useMemo(
        () => ({
            uColorA: { value: new Color().setRGB(...palette.a) },
            uColorB: { value: new Color().setRGB(...palette.b) },
            uColorC: { value: new Color().setRGB(...palette.c) },
            uColorD: { value: new Color().setRGB(...palette.d) },
            // Staggered phase: cards mount together but do not breathe in unison.
            uTime: { value: v * 11.0 + 3 },
            uVariant: { value: v },
            uPointer: { value: new Vector2() },
        }),
        [v, palette]
    );

    useFrame((_, delta) => {
        // Clamped so a resumed tab does not jump the drift forward by the whole hidden interval.
        uniforms.uTime.value += Math.min(delta, 0.1);
        pointer.current.lerp(target.current, 0.08);
        uniforms.uPointer.value.copy(pointer.current);
    });

    return (
        <mesh frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={BACKDROP_VERTEX_SHADER}
                fragmentShader={BACKDROP_FRAGMENT_SHADER}
                uniforms={uniforms}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Owns one tiny WebGL scene. The card around it stays pure CSS, so the tilt box never gets a
 * canvas-sized layer of its own — this host is just an absolutely positioned child of the frame.
 *
 * @param {{
 *   variant: number,
 *   palette: { a: number[], b: number[], c: number[], d: number[] },
 *   lite?: boolean,
 * }} props
 */
export default function TeamBackdrop({ variant, palette, lite = false }) {
    const hostRef = useRef(null);
    const pointer = useRef(new Vector2());
    const pointerTarget = useRef(new Vector2());
    const [inView, setInView] = useState(true);
    const [tabActive, setTabActive] = useState(true);

    useEffect(() => {
        const el = hostRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return undefined;
        // Wider than the card so the drift is already running when the card scrolls up into view.
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin: '30% 0%',
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const sync = () => setTabActive(!document.hidden);
        sync();
        document.addEventListener('visibilitychange', sync);
        return () => document.removeEventListener('visibilitychange', sync);
    }, []);

    useEffect(() => {
        const onPointerMove = (event) => {
            if (event.pointerType !== 'mouse') return;
            const box = hostRef.current?.getBoundingClientRect();
            if (!box?.width) return;
            // Card-local: a pointer crossing the grid pulls only the backdrop it is over.
            pointerTarget.current.set(
                (event.clientX - box.left) / box.width - 0.5,
                (event.clientY - box.top) / box.height - 0.5
            );
        };
        const onLeave = () => pointerTarget.current.set(0, 0);

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerleave', onLeave);
        window.addEventListener('blur', onLeave);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('blur', onLeave);
        };
    }, []);

    const running = inView && tabActive;

    return (
        <span ref={hostRef} className="absolute inset-0" aria-hidden="true">
            <Canvas
                // 'demand' keeps the scene dark until the first invalidate() lands, which strands the
                // card on its dark fallback; 'always' draws from mount and 'never' freezes the last frame.
                frameloop={running ? 'always' : 'never'}
                dpr={DPR_LIMITS[lite ? 'lite' : 'full']}
                gl={{
                    antialias: false,
                    alpha: false,
                    stencil: false,
                    depth: false,
                    powerPreference: 'low-power',
                }}
                flat
            >
                <BackdropPlane variant={variant} palette={palette} pointer={pointer} target={pointerTarget} />
            </Canvas>
        </span>
    );
}
