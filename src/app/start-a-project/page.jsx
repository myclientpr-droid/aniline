import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import InquiryForm from '@/components/forms/InquiryForm';
import PageSchema from '@/components/seo/PageSchema';
import { buildMetadata } from '@/lib/seo';
import { START_PROJECT_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Start a Project | AniLine',
    description:
        "Tell AniLine about your video, photography, or post-production project. Share a few details and we'll be in touch.",
    path: '/start-a-project',
});

export default function StartProjectPage() {
    const { hero, success, privacy } = START_PROJECT_PAGE;

    return (
        <>
            <PageSchema
                path="/start-a-project"
                title="Start a Project | AniLine"
                description={metadata.description}
                type="ContactPage"
            />
            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <section className="section-padding bg-white">
                <Container>
                    <div className="rise mx-auto max-w-3xl">
                        <InquiryForm
                            successTitle={success.title}
                            successMessage={success.message}
                        />
                        <p className="text-slate text-xs mt-6">{privacy.note}</p>
                    </div>
                </Container>
            </section>
        </>
    );
}