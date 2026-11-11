'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildImageUrl } from '@/lib/cloudinary';
import { photoShape } from '@/lib/photoShapes';

/*
 * Justified rows: flex-basis and flex-grow are both the tile's own ratio, so the width it
 * ends up with is always ratio x the row's single shared height — mixed shapes pack into one
 * gapless line with no JS. The calc() basis only guesses how many tiles fit; the browser
 * resolves the real height, so these constants never need recomputing.
 */
const TILES = {
    '4:5': {
        aspect: 'aspect-[4/5]',
        grow: 'grow-[0.8]',
        basis: 'basis-[calc(0.8*var(--row-h))]',
        sizes: '(min-width: 1152px) 15vw, (min-width: 768px) 22vw, 89vw',
    },
    '4:3': {
        aspect: 'aspect-[4/3]',
        grow: 'grow-[1.3333]',
        basis: 'basis-[calc(1.3333*var(--row-h))]',
        sizes: '(min-width: 1152px) 19vw, (min-width: 768px) 45vw, 89vw',
    },
    '3:2': {
        aspect: 'aspect-[3/2]',
        grow: 'grow-[1.5]',
        basis: 'basis-[calc(1.5*var(--row-h))]',
        sizes: '(min-width: 1152px) 25vw, (min-width: 768px) 45vw, 89vw',
    },
};

/**
 * @param {{
 *   photos: Array<{
 *     _id: string,
 *     title?: string,
 *     alt?: string,
 *     caption?: string,
 *     publicId: string,
 *     width?: number,
 *     height?: number,
 *     gridShape?: string,
 *   }>,
 * }} props
 */
export default function Gallery({ photos }) {
    const [openIndex, setOpenIndex] = useState(-1);
    const closeBtnRef = useRef(null);

    const open = openIndex >= 0;
    const current = open ? photos[openIndex] : null;

    const close = useCallback(() => setOpenIndex(-1), []);
    const next = useCallback(
        () => setOpenIndex((i) => (i + 1) % photos.length),
        [photos.length]
    );
    const prev = useCallback(
        () => setOpenIndex((i) => (i - 1 + photos.length) % photos.length),
        [photos.length]
    );

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const t = setTimeout(() => closeBtnRef.current?.focus(), 30);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            clearTimeout(t);
        };
    }, [open, close, next, prev]);

    if (!photos || photos.length === 0) return null;

    return (
        <>
            {/* Grid */}
            <ul className="tile-grid flex flex-wrap gap-3 md:gap-4 [--row-h:16rem] md:[--row-h:12rem]">
                {photos.map((photo, i) => {
                    const { value: shape, ratio } = photoShape(photo);
                    const tile = TILES[shape];
                    const thumb = buildImageUrl(photo.publicId, {
                        width: 600,
                        height: Math.round(600 / ratio),
                        crop: 'fill',
                    });
                    const alt = photo.alt || photo.title || `Photograph ${i + 1}`;
                    return (
                        <li
                            key={String(photo._id || photo.publicId)}
                            className={`rise rise-${(i % 3) + 1} ${tile.grow} ${tile.basis}`}
                        >
                            {/* Three boxes, three jobs: the li reveals, the div owns the 3D, the button
                                clips. Any mask on the tilt box would flatten it back to 2D. */}
                            <div data-tilt="" className="tilt-card specular rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(i)}
                                    className={`group tile-dim elevate-1 relative block w-full ${tile.aspect} overflow-hidden rounded-lg bg-navy-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange`}
                                    aria-label={`Open ${alt}`}
                                >
                                    <Image
                                        src={thumb}
                                        alt={alt}
                                        fill
                                        sizes={tile.sizes}
                                        className="object-cover transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-[1.03]"
                                    />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Lightbox */}
            {open && current && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Photograph viewer"
                    className="fixed inset-0 z-50 bg-navy-dark/95 backdrop-blur-sm flex items-center justify-center"
                >
                    <button
                        type="button"
                        aria-label="Close viewer"
                        onClick={close}
                        className="absolute inset-0 cursor-zoom-out"
                    />

                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={close}
                        aria-label="Close viewer"
                        className="absolute top-4 right-4 z-10 p-2 rounded-md text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                    >
                        <X className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Previous photograph"
                                className="absolute left-3 md:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                            >
                                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next photograph"
                                className="absolute right-3 md:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                            >
                                <ChevronRight className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </>
                    )}

                    <div className="relative max-h-[85vh] max-w-[92vw] flex flex-col items-center px-4">
                        <div className="relative w-full">
                            <Image
                                src={buildImageUrl(current.publicId, { width: 1600 })}
                                alt={current.alt || current.title || `Photograph ${openIndex + 1}`}
                                width={1600}
                                height={
                                    current.width && current.height
                                        ? Math.round((1600 * current.height) / current.width)
                                        : 1067
                                }
                                sizes="92vw"
                                className="max-h-[80vh] w-auto h-auto object-contain rounded-md"
                                priority
                            />
                        </div>
                        {(current.title || current.caption) && (
                            <div className="mt-4 text-center text-white/80 max-w-xl">
                                {current.title && <p className="text-sm font-medium">{current.title}</p>}
                                {current.caption && <p className="text-xs mt-1">{current.caption}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}