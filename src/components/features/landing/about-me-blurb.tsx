import { ExpandableText } from './expandable-text';

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start text-body select-none">
            <p>Hey, I’m Kitts.</p>
            <p>
                I'm{' '}
                <ExpandableText summary="from the Philippines">
                    from Surigao del Norte, Philippines, on the island of{' '}
                    <ExpandableText summary="Mindanao">
                        Mindanao, the southernmost of the country's three major island groups
                    </ExpandableText>
                </ExpandableText>
                . I write code for a living and spend most of my time
                figuring out how things work.
            </p>
            <p>
                I'm interested in field applications of software systems for
                research, surveying, mapping, and auditing of physical environments,
                and where all of that is headed as AI technologies become more intelligent and accessible.
            </p>
            <p>
                Photography, cooking, video games,
                or just being outdoors are things I usually do when I’m not busy with code.
            </p>
        </div>
    );
}
