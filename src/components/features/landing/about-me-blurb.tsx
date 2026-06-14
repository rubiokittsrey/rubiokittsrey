import { ArrowDownToLineIcon, ArrowUpRight, LinkIcon } from 'lucide-react';
import { ExpandableText } from './expandable-text';
import PublicNavItem from '../navigation/public-nav/public-nav-item';

function OriginExpandable() {
    return (
        <ExpandableText summary="from the Philippines">
            from Surigao del Norte, Philippines, on the island of{' '}
            <ExpandableText summary="Mindanao">
                Mindanao, the southernmost of the country's three major island groups
            </ExpandableText>
        </ExpandableText>
    );
}

function WorkExpandable() {
    return (
        <ExpandableText summary="write code for a living">
            am a fullstack developer{' '}
            <ExpandableText summary="building web and mobile apps">
                building web and mobile apps across a handful of stacks. I build projects as a way
                to understand how things work{' '}
                <a href="#" className="inline-flex underline underline-offset-2 hover:text-sky-600">
                    {/* TODO: download resume link */}
                    (here&rsquo;s my full resume) <ArrowDownToLineIcon className="size-3" />
                </a>
            </ExpandableText>
        </ExpandableText>
    );
}

function InterestsExpandable() {
    return (
        <>
            <ExpandableText summary="field applications of software for mapping out the physical world">
                field applications of software systems for research, surveying, mapping, and
                auditing physical environments with sensors, telemetry, and geolocation
                technologies, and{' '}
                <ExpandableText summary="how AI can take it further">
                    {' '}
                    how AI can help improve visibility and insight into the environmental data
                    collected from these systems
                </ExpandableText>
            </ExpandableText>
        </>
    );
}

function HobbiesExpandable() {
    return (
        <ExpandableText summary="take photographs">
            take photographs and post them on my{' '}
            <span className="inline-flex hover:text-blue-500">
                <PublicNavItem
                    title="gallery"
                    path="/gallery"
                    className="text-surface-foreground hover:text-blue-500 underline"
                />{' '}
                <ArrowUpRight className="size-3 mt-1" />
            </span>
        </ExpandableText>
    );
}

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start text-body select-none">
            <p>Hey, I’m Kitts.</p>
            <p>
                I'm <OriginExpandable />. I <WorkExpandable />.
            </p>
            <p>
                I'm interested in <InterestsExpandable />.
            </p>
            <p>
                {/* When I'm not busy with code, I <HobbiesExpandable />. */}
                <PublicNavItem
                    title="Photography"
                    path="/gallery"
                    className="text-surface-foreground hover:text-blue-600 underline decoration-1 underline-offset-4"
                />, cooking, video games, or just being outdoors are things I usually do
                when I’m not busy with code.
            </p>
        </div>
    );
}
