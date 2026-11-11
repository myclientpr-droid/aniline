/**
 * Which grid shape a photograph tiles with.
 *
 * Pure — no DB, no React — so the gallery, the admin validation and a plain `node`
 * check all resolve a shape the same way.
 */

import { PHOTO_GRID_SHAPES } from '@/lib/constants';

const SHAPES = PHOTO_GRID_SHAPES.map((value) => {
    const [width, height] = value.split(':').map(Number);
    return { value, ratio: width / height };
});

/** Used when a photo carries no usable dimensions, e.g. a pasted public ID. */
export const DEFAULT_PHOTO_SHAPE = '3:2';

function shapeByValue(value) {
    return SHAPES.find((shape) => shape.value === value) || null;
}

/**
 * Nearest shape in log space. Linear distance would make 4:3 grab every ratio between
 * 0.8 and 1.5, which reads as "everything is 4:3"; in log space 4:5 and 3:2 sit
 * equidistant from it, so a square photo gets the portrait tile it actually needs.
 * @param {number} ratio - intrinsic width / height
 * @returns {{ value: string, ratio: number }}
 */
export function shapeFromRatio(ratio) {
    if (!Number.isFinite(ratio) || ratio <= 0) return shapeByValue(DEFAULT_PHOTO_SHAPE);

    let best = SHAPES[0];
    let bestGap = Infinity;
    for (const shape of SHAPES) {
        const gap = Math.abs(Math.log(shape.ratio / ratio));
        if (gap < bestGap) {
            best = shape;
            bestGap = gap;
        }
    }
    return best;
}

/**
 * The shape a photo should be tiled with: the admin's override wins, otherwise the
 * stored dimensions decide, otherwise the default.
 * @param {{ gridShape?: string, width?: number, height?: number }} [photo]
 * @returns {{ value: string, ratio: number }}
 */
export function photoShape(photo) {
    const explicit = shapeByValue(photo?.gridShape);
    if (explicit) return explicit;

    const width = Number(photo?.width);
    const height = Number(photo?.height);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        return shapeFromRatio(width / height);
    }
    return shapeByValue(DEFAULT_PHOTO_SHAPE);
}
