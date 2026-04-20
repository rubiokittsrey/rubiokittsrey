import { Label } from '@/components/ui/label';

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start max-w-3/5">
            <p>Hey, I'm Kitts.</p>
            <p>I'm from Mindanao, Philippines. I build and develop software for a living.</p>
            <p>
                I'm interested in how software systems are applied in the real world for research,
                surveying, mapping, and auditing physical environments — and where all of that is
                headed as AI technologies become more intelligent and accessible.
            </p>
            <p>I also enjoy videogames, esports, food, photography, and the outdoors.</p>
        </div>
    );
}
