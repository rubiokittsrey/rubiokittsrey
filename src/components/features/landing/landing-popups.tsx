import { PopUp } from './pop-up';

function Placeholder({ label }: { label: string }) {
    return (
        <div className="w-52 aspect-4/3 rounded-sm border border-current/10 bg-current/3 flex items-center justify-center text-xxs font-mono text-current/40 select-none">
            {label}
        </div>
    );
}

export function LandingPopUps() {
    return (
        <>
            <PopUp id="philippines" position={{ top: '18%', left: '6%' }}>
                <Placeholder label="philippines.jpg" />
            </PopUp>
            <PopUp id="code" position={{ top: '14%', right: '8%' }}>
                <Placeholder label="code.jpg" />
            </PopUp>
            <PopUp id="research" position={{ bottom: '24%', left: '6%' }}>
                <Placeholder label="research.jpg" />
            </PopUp>
            <PopUp id="photography" position={{ bottom: '16%', right: '8%' }}>
                <Placeholder label="photography.jpg" />
            </PopUp>
            <PopUp id="cooking" position={{ top: '46%', right: '5%' }}>
                <Placeholder label="cooking.jpg" />
            </PopUp>
            <PopUp id="video-games" position={{ top: '54%', left: '5%' }}>
                <Placeholder label="videogames.jpg" />
            </PopUp>
        </>
    );
}
