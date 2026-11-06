'use client';

// three.js drives a scene by mutating uniforms, transforms and the camera each frame — that is the
// R3F API surface, not React state. The React Compiler's immutability rule cannot express that.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils, Vector2 } from 'three';
import { getHeroSceneSettings } from '@/lib/heroCapabilities';
import { HERO_FRAGMENT_SHADER, HERO_VERTEX_SHADER, computeCover } from './heroShaders';
import { createHeroVideo, disposeHeroVideo } from './heroVideo';

// Kept below 1 so the poster underneath the canvas stays painted.
const PLANE_OPACITY = 0.9;
const DAMPING = 3.2;
// Half speed keeps the reel from reading as a hurried background loop.
const PLAYBACK_RATE = 0.5;

function createScene() {
    return {
        mouse: new Vector2(),
        mouseTarget: new Vector2(),
        scroll: 0,
        scrollTarget: 0,
    };
}

/** Reads pointer and scroll once, damps them, and moves the camera so the frames get real parallax. */
function HeroRig({ animated, scene }) {
    const camera = useThree((state) => state.camera);
    const canvasEl = useThree((state) => state.gl.domElement);

    useEffect(() => {
        if (!animated) return undefined;

        const onPointerMove = (event) => {
            scene.current.mouseTarget.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
        };
        const onScroll = () => {
            const span = canvasEl.parentElement?.clientHeight || window.innerHeight;
            scene.current.scrollTarget = Math.min(
                1,
                Math.max(0, window.scrollY / Math.max(1, span))
            );
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('scroll', onScroll);
        };
    }, [animated, canvasEl, scene]);

    useFrame((_, delta) => {
        const s = scene.current;
        s.mouse.set(
            MathUtils.damp(s.mouse.x, s.mouseTarget.x, DAMPING, delta),
            MathUtils.damp(s.mouse.y, s.mouseTarget.y, DAMPING, delta)
        );
        s.scroll = MathUtils.damp(s.scroll, s.scrollTarget, DAMPING, delta);

        camera.position.set(s.mouse.x * 0.38, s.mouse.y * 0.22, 5);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

/** The video-texture quad, plus the procedural brand treatment while no reel is configured. */
function HeroPlane({ videoSrcs, tier, active, scene }) {
    // Reels are compared by content: the boundary rebuilds the array on every render.
    const reelKey = videoSrcs.join('\n');
    const size = useThree((state) => state.size);
    const invalidate = useThree((state) => state.invalidate);
    const settings = useMemo(() => getHeroSceneSettings(tier), [tier]);

    const materialRef = useRef(null);
    const mediaRef = useRef(null);
    const activeRef = useRef(active);
    const [mediaReady, setMediaReady] = useState(false);

    // R3F copies the `uniforms` prop into the material instead of adopting it, so the memo below is
    // seed data only. Every value the shader must actually read is written through materialRef.
    const seedUniforms = useMemo(
        () => ({
            uMap: { value: null },
            uHasVideo: { value: 0 },
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uOpacity: { value: 0 },
            uEdgeFx: { value: 0 },
            uMouse: { value: new Vector2() },
            uCoverScale: { value: new Vector2(1, 1) },
        }),
        []
    );

    useEffect(() => {
        const uniforms = materialRef.current?.uniforms;
        if (!uniforms) return;
        // Animated tiers fade the plane in from the poster; a static one has no loop to fade with.
        uniforms.uOpacity.value = settings.animated ? 0 : PLANE_OPACITY;
        uniforms.uEdgeFx.value = settings.edgeFx ? 1 : 0;
        uniforms.uHasVideo.value = 0;
        uniforms.uCoverScale.value.set(1, 1);
        invalidate();
    }, [settings, invalidate]);

    useEffect(() => {
        // gl-static never plays the reel, so it must not download it either — the procedural
        // treatment is the static frame.
        const srcs = reelKey ? reelKey.split('\n') : [];
        if (srcs.length === 0 || !settings.animated) return undefined;
        const material = materialRef.current;
        if (!material) return undefined;

        const uniforms = material.uniforms;
        // One element is reused for the whole reel, so each change swaps the source instead of
        // rebuilding the texture — no flash back to the poster between clips.
        const media = createHeroVideo(srcs[0]);
        media.video.loop = srcs.length === 1;
        // Rate is per element, not per source, so it survives every clip swap in the reel.
        media.video.playbackRate = PLAYBACK_RATE;
        mediaRef.current = media;
        uniforms.uMap.value = media.texture;

        let cancelled = false;
        let index = 0;

        const play = () => {
            if (activeRef.current) media.video.play().catch(() => {});
        };
        const onEnded = () => {
            if (srcs.length < 2) return;
            index = (index + 1) % srcs.length;
            media.video.src = srcs[index];
            media.video.load();
            play();
        };

        const onLoaded = () => {
            if (cancelled) return;
            uniforms.uHasVideo.value = 1;
            setMediaReady(true);
            play();
            invalidate();
        };
        // A dead, blocked, or tainted source must fall back to the procedural look, not a black quad.
        const onError = () => {
            if (cancelled) return;
            uniforms.uHasVideo.value = 0;
            setMediaReady(false);
            invalidate();
        };

        media.video.addEventListener('loadeddata', onLoaded);
        media.video.addEventListener('error', onError);
        media.video.addEventListener('ended', onEnded);

        return () => {
            cancelled = true;
            media.video.removeEventListener('loadeddata', onLoaded);
            media.video.removeEventListener('error', onError);
            media.video.removeEventListener('ended', onEnded);
            disposeHeroVideo(media);
            mediaRef.current = null;
            uniforms.uMap.value = null;
            uniforms.uHasVideo.value = 0;
            setMediaReady(false);
        };
    }, [reelKey, settings, invalidate]);

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    useEffect(() => {
        // Clips may differ in aspect ratio, so the cover crop is recomputed on every load.
        const material = materialRef.current;
        const video = mediaRef.current?.video;
        if (!material || !settings.animated) return undefined;
        const applyCover = () => {
            if (!video?.videoWidth) return;
            const [sx, sy] = computeCover(
                size.width / size.height,
                video.videoWidth / video.videoHeight
            );
            material.uniforms.uCoverScale.value.set(sx, sy);
            invalidate();
        };
        applyCover();
        video?.addEventListener('loadeddata', applyCover);
        return () => video?.removeEventListener('loadeddata', applyCover);
    }, [reelKey, size, settings, invalidate]);

    useEffect(() => {
        const media = mediaRef.current;
        if (!media || !settings.animated) return;
        if (active && media.video.videoWidth) {
            media.video.play().catch(() => {});
        } else if (!active) {
            media.video.pause();
        }
    }, [active, settings]);

    useFrame((_, delta) => {
        const uniforms = materialRef.current?.uniforms;
        if (!uniforms) return;
        uniforms.uTime.value += delta;
        uniforms.uMouse.value.copy(scene.current.mouse);
        uniforms.uScroll.value = scene.current.scroll;
        if (settings.animated) {
            uniforms.uOpacity.value = MathUtils.damp(
                uniforms.uOpacity.value,
                PLANE_OPACITY,
                4,
                delta
            );
        }
    });

    return (
        <mesh frustumCulled={false} renderOrder={-1}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={HERO_VERTEX_SHADER}
                fragmentShader={HERO_FRAGMENT_SHADER}
                uniforms={seedUniforms}
                transparent
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}

export default function HeroCanvas({ tier, videoSrcs = [] }) {
    const settings = useMemo(() => getHeroSceneSettings(tier), [tier]);
    const wrapperRef = useRef(null);
    const scene = useRef(createScene());
    const [inView, setInView] = useState(true);
    const [tabActive, setTabActive] = useState(true);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin: '10% 0%',
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

    if (!settings) return null;

    const running = settings.animated && inView && tabActive;

    return (
        <div ref={wrapperRef} className="hero-gl-canvas absolute inset-0" aria-hidden="true">
            <Canvas
                // 'never' ignores invalidate() entirely, which would strand the static tier on a
                // pre-uniform frame and blank the buffer on every resize. 'demand' renders on request.
                frameloop={running ? 'always' : settings.animated ? 'never' : 'demand'}
                dpr={[1, settings.maxDpr]}
                camera={{ fov: 75, position: [0, 0, 5], near: 0.1, far: 100 }}
                gl={{
                    antialias: false,
                    alpha: true,
                    stencil: false,
                    powerPreference: 'low-power',
                }}
                flat
            >
                <HeroRig animated={running} scene={scene} />
                <HeroPlane videoSrcs={videoSrcs} tier={tier} active={running} scene={scene} />
            </Canvas>
        </div>
    );
}
