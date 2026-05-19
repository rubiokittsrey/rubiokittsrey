import { PopUpTrigger } from './pop-up-trigger';

export default function AboutMeBlurb() {
    return (
        <div className="flex flex-col space-y-5 items-start text-body select-none">
            <p>Hey, I’m Kitts.</p>
            <p>
                Based in the <PopUpTrigger id="philippines">Philippines</PopUpTrigger>. I write{' '}
                <PopUpTrigger id="code">code</PopUpTrigger> for a living and spend most of my time
                figuring out how things work — and how to make them feel approachable.
            </p>
            <p>
                I'm interested in field applications of software systems for{' '}
                <PopUpTrigger id="research">research, surveying, mapping</PopUpTrigger>, and
                auditing of physical environments, and where all of that is headed as AI
                technologies become more intelligent and accessible.
            </p>
            <p>
                <PopUpTrigger id="photography">Photography</PopUpTrigger>,{' '}
                <PopUpTrigger id="cooking">cooking</PopUpTrigger>, video games, or just being{' '}
                <PopUpTrigger id="outdoors">outdoors</PopUpTrigger> are things I usually do when
                I’m not busy with code.
            </p>
        </div>
    );
}
