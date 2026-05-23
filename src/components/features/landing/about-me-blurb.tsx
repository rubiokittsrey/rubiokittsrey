import { PopUpTrigger } from './pop-up-trigger';

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start text-body select-none">
            <p>Hey, I’m Kitts.</p>
            <p>
                I'm <PopUpTrigger id="philippines">from the Philippines</PopUpTrigger>. I {' '}
                <PopUpTrigger id="code">write code for a living</PopUpTrigger> and spend most of my time
                figuring out how things work.
            </p>
            <p>
                I'm interested in field applications of <PopUpTrigger id="research"> software systems for
                research, surveying, mapping, and auditing of physical environments</PopUpTrigger>,
                and where all of that is headed as AI technologies become more intelligent and accessible.
            </p>
            <p>
                <PopUpTrigger id="photography">Photography</PopUpTrigger>,{' '}
                <PopUpTrigger id="cooking">cooking</PopUpTrigger>, {' '}
                <PopUpTrigger id="video-games">video games</PopUpTrigger>, {' '}
                or just being outdoors are things I usually do when I’m not busy with code.
            </p>
        </div>
    );
}
