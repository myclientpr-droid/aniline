import Link from 'next/link';
import TeamPortrait from '@/components/team/TeamPortrait';
import TeamSocialLinks from '@/components/team/TeamSocialLinks';

/**
 * @param {{
 *   member: {
 *     _id?: string,
 *     name: string,
 *     slug?: string,
 *     role?: string,
 *     bio?: string,
 *     expertise?: string[],
 *     photo?: { publicId: string, alt?: string },
 *     social?: { linkedin?: string, instagram?: string },
 *   },
 * }} props
 */
export default function TeamCard({ member }) {
    const { name, role, bio, expertise = [], slug, social } = member;

    // A slug means "this is a real row", so the static fallback members stay inert instead of
    // linking to a 404.
    const href = slug ? `/team/${slug}` : null;

    return (
        <article className="group h-full">
            {/* Two boxes on purpose: the tilt owns the transform and must not clip, so the
                rounded mask lives on the inner frame instead of this element. */}
            <div
                data-tilt=""
                className="tilt-card specular-warm h-full rounded-[1.25rem] ring-1 ring-navy/8 shadow-[0_1px_2px_rgba(0,19,62,0.06),0_18px_40px_-24px_rgba(0,19,62,0.35)] transition-[box-shadow,ring-color] duration-500 ease-[var(--ease-cinematic)] group-hover:ring-orange/40 group-hover:shadow-[0_2px_4px_rgba(0,19,62,0.07),0_30px_60px_-28px_rgba(0,19,62,0.45)]"
            >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white leading-normal">
                    <TeamPortrait member={member} className="m-2.5 pointer-events-none" />

                    {/* No `tilt-lift-*` here: the mask flattens its subtree anyway, and a transform
                        would make this box a stacking context — which would bury the social tiles
                        under the overlay below instead of letting their `z-10` escape it. */}
                    <div className="pointer-events-none flex flex-1 flex-col items-center px-4 pb-5 pt-3 text-center">
                        <h3 className="text-navy text-[1.0625rem] font-bold leading-snug">{name}</h3>

                        {bio && (
                            <p className="text-slate mt-2 line-clamp-3 text-[0.8125rem] leading-6">
                                {bio}
                            </p>
                        )}
                        {/* Cards without a bio still get a rule, so the name never floats. */}
                        <span
                            aria-hidden="true"
                            className={`h-px w-10 rounded-full bg-gradient-to-r from-transparent via-orange/70 to-transparent ${bio ? 'mt-3' : 'mt-2.5'}`}
                        />

                        {expertise.length > 0 && (
                            <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                                {expertise.slice(0, 3).map((e) => (
                                    <li
                                        key={e}
                                        className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-[#9a6400] ring-1 ring-inset ring-orange/20"
                                    >
                                        {e}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <TeamSocialLinks
                            member={{ name, social }}
                            className="relative z-10 mt-auto pointer-events-auto justify-center pt-4"
                        />
                    </div>

                    {href && (
                        <Link
                            href={href}
                            aria-label={`View ${name}'s profile`}
                            className="absolute inset-0 z-[1] cursor-pointer rounded-[1.25rem] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange"
                        />
                    )}
                </div>
            </div>
        </article>
    );
}
