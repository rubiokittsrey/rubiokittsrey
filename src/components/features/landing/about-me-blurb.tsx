import { ArrowDownToLineIcon, ArrowUpRight, LinkIcon } from 'lucide-react';
import { ExpandableText } from './expandable-text';
import PublicNavItem from '../navigation/public-nav/public-nav-item';

function OriginExpandable() {
    return (
        <ExpandableText summary="from the Philippines" color="violet">
            from the Philippines<span>, in Surigao del Norte,</span> <span>on the island of</span>{' '}
            <ExpandableText summary="Mindanao">{' '}
                Mindanao<span>, the southernmost of the country's</span> <span>three major island groups</span>
            </ExpandableText>
        </ExpandableText>
    );
}

function WorkExpandable() {
    return (
        <ExpandableText summary="write code for a living" color="red">
            write code for a living<span>, I am a</span> <span>fullstack developer</span>{' '}
            <ExpandableText summary="building web and mobile apps">
                building web and mobile apps <span>across a handful of stacks.</span> <span>I build projects as a way </span>
                <span>to understand how things work</span>
                {/* <a href="#" className="inline-flex underline underline-offset-2 hover:text-sky-600">
                    (here&rsquo;s my full resume) <ArrowDownToLineIcon className="size-3" />
                </a> */}
            </ExpandableText>
        </ExpandableText>
    );
}

function InterestsExpandable() {
    return (
        <>
            <ExpandableText summary="field applications of software for mapping out the physical world" color="emerald">
                field applications of software for mapping out the physical world<span> through research, surveying, mapping</span>{' '}
                <span>and auditing physical environments</span>
                <span>with sensors, telemetry, and geolocation technologies, </span>and{' '}
                <ExpandableText summary="how AI can take it further">
                    {' '}
                    how AI can take it further <span>by improving visibility and insight</span>{' '}
                    <span>into the environmental data</span>{' '}
                    <span>collected from these systems</span>
                </ExpandableText>
            </ExpandableText>
        </>
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
