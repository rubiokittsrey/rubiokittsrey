import PublicNavItem from '../navigation/public-nav/public-nav-item';

function Greeting() {
    return <p>Hey, I’m Kitts.</p>;
}

function Background() {
    return (
        <p>
            I’m from the Philippines — Surigao del Norte, on Mindanao, the southernmost of our three
            major island groups. I write code for a living as a fullstack developer, working across
            a handful of stacks, and I build things mostly to understand how they work.
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
                title="Photography"
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
