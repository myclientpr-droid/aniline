'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import {
    HERO_TIERS,
    getHeroTierServerSnapshot,
    getHeroTierSnapshot,
    subscribeHeroTier,
} from '@/lib/heroCapabilities';

// `ssr: false` is only legal inside a Client Component, which is why this wrapper exists. The
// shader and three.js are fetched only after the tier says this device would actually run them.
const TeamBackdrop = dynamic(() => import('./TeamBackdrop'), { ssr: false });

/**
 * @param {{ variant: number, palette: { a: number[], b: number[], c: number[], d: number[] } }} props
 */
export default function TeamBackdropBoundary({ variant, palette }) {
    const tier = useSyncExternalStore(subscribeHeroTier, getHeroTierSnapshot, getHeroTierServerSnapshot);

    // CSS tier means no WebGL worth driving (save-data, weak GPU, software raster). GL_STATIC means the
    // visitor asked for less motion — the palette gradient underneath is the static frame.
    if (tier === HERO_TIERS.CSS || tier === HERO_TIERS.GL_STATIC) return null;

    return <TeamBackdrop variant={variant} palette={palette} lite={tier === HERO_TIERS.GL_LITE} />;
}
