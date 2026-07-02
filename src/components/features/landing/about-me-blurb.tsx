import { ExpandableText } from './expandable-text';
import PublicNavItem from '../navigation/public-nav/public-nav-item';

function Greeting() {
    return <p>Hey, I’m Kitts.</p>;
}

function Background() {
    return (
        <p>
            I’m from the{' '}
            <ExpandableText summary="Philippines">
                Philippines<span>, an archipelago of over 7,000 islands in Southeast Asia</span>{' '}
                <span>— Surigao del Norte, on Mindanao,</span>{' '}
                <span>the southernmost of our three major island groups</span>
            </ExpandableText>.
            I write code for a living as a fullstack developer with experience working across a handful of{' '}
            <ExpandableText summary="stacks">
                stacks<span>: Next.js, React, Vue, and Vite on the frontend;</span>{' '}
                <span>Django, FastAPI, Laravel, Firebase, and Supabase on the backend;</span>{' '}
                <span>and Flutter, Dart, and native Java for mobile</span>
            </ExpandableText>.
            I like to build projects to understand how certain technologies work.
        </p>
    );
}

function Interests() {
    return (
        <p>
            These days I’m drawn to the field applications of software — using research, surveying,
            and sensors to monitor and make sense of the physical environment, with telemetry and
            geolocation tying it all together. I’m especially curious about how AI can take that
            further, turning raw environmental data into something clearer and more useful.
        </p>
    );
}

function Pastimes() {
    return (
        <p>
            When I’m not busy with code, you’ll usually find me into{' '}
            <PublicNavItem
                title="photography"
                path="/gallery"
                className="text-accent hover:underline"
            />
            , cooking, video games, or just being outdoors.
        </p>
    );
}

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start text-body select-none">
            <Greeting />
            <Background />
            <Interests />
            <Pastimes />
        </div>
    );
}
