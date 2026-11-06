import Image from 'next/image';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import HeroCanvasBoundary from '@/components/home/hero/HeroCanvasBoundary';
import { buildVideoUrl, buildVideoPoster, buildImageUrl } from '@/lib/cloudinary';
import { SITE, HOME, PRIMARY_CTA } from '@/lib/site';

// Matches the poster's drift animation so the still reel looks the same with or without JS.
const POSTER_CYCLE_SECONDS = 24;

export default function Hero() {
    const { hero } = HOME;

    // Overrides win outright: they are the whole reel, on every device. Otherwise Cloudinary
    // builds the reel, and coarse-pointer tiers get a narrower encode of the same clips.
    const cloudinaryIds = [hero.videoPublicId, ...hero.extraVideoPublicIds].filter(Boolean);
    const clips =
        hero.videoSrcOverrides.length > 0
            ? hero.videoSrcOverrides.map((override) => ({ override }))
            : cloudinaryIds.map((id) => ({ id }));

    const videoSrcs = clips.map(
        (clip) => clip.override || buildVideoUrl(clip.id, { width: 1600 })
    );
    const videoSrcsLite = clips.map(
        (clip) => clip.override || buildVideoUrl(clip.id, { width: 1024 })
    );

    // Stills shown before WebGL boots and on no-JS / low-end visits. Several clips cycle through
    // their posters; a single still is a static image; nothing configured falls back to a gradient.
    const posters =
        clips.length > 1
            ? clips.map((clip) =>
                  clip.id ? buildVideoPoster(clip.id, { width: 1920 }) : hero.posterSrc
              )
            : [
                  (hero.posterPublicId
                      ? buildImageUrl(hero.posterPublicId, { width: 1920, crop: 'fill' })
                      : clips[0]?.id
                        ? buildVideoPoster(clips[0].id, { width: 1920 })
                        : null) ||
                      hero.posterSrc ||
                      null,
              ].filter(Boolean);

    return (
        <section className="relative isolate overflow-hidden bg-navy-dark text-white">
            {/* Media layer */}
            <div className="hero-media absolute inset-0 -z-10">
                {posters.length > 0 ? (
                    <div
                        className="hero-poster-reel absolute inset-0"
                        style={{ '--hero-reel-duration': `${POSTER_CYCLE_SECONDS}s` }}
                    >
                        {posters.map((src, i) => (
                            <Image
                                key={`${src}-${i}`}
                                src={src}
                                alt=""
                                fill
                                priority={i === 0}
                                sizes="100vw"
                                className="hero-poster object-cover"
                                style={{
                                    animationDelay: `${(i * POSTER_CYCLE_SECONDS) / posters.length}s`,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-black"
                    />
                )}

                {/* CSS-only cinematic layer; stands in for the canvas where WebGL is not worth it. */}
                <div className="hero-sheen absolute inset-0" aria-hidden="true" />

                <HeroCanvasBoundary videoSrcs={videoSrcs} videoSrcsLite={videoSrcsLite} />

                <div className="cinematic-overlay absolute inset-0" aria-hidden="true" />
            </div>

            {/* Content */}
            <Container>
                <div className="min-h-[88vh] md:min-h-[92vh] flex flex-col justify-end pt-32 pb-16 md:pt-40 md:pb-24">
                    <p className="text-orange text-xs md:text-sm font-semibold uppercase tracking-[0.2em]">
                        {hero.eyebrow}
                    </p>

                    <h1 className="text-white mt-5 max-w-4xl text-balance">
                        {hero.heading || SITE.message}
                    </h1>

                    <p className="text-white/80 mt-6 max-w-2xl text-base md:text-lg">
                        {hero.subheading}
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        <Button href={PRIMARY_CTA.href} variant="primary" size="lg">
                            {PRIMARY_CTA.label}
                        </Button>
                        <Button href="/work" variant="outlineLight" size="lg">
                            Explore Our Work
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
