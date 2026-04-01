import { GlobeWireIcon } from '@/assets/icons';

export default function AboutMeBlurb() {
    return (
        <div className="flex space-x-5">
            <div className="flex-1 flex flex-col justify-between">
                <p className="font-mono text-base whitespace-pre-line">
                    {'I AM A SOFTWARE\nDEVELOPER\nBASED IN THE PHILIPPINES'}
                </p>
                <GlobeWireIcon className="" />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-10">
                <p className="font-mono text-base whitespace-pre-line">
                    {'I ENJOY BUILDING, DESIGNING\nAND CREATING THINGS'}
                </p>
            </div>
            <div className="flex-1 text-end">
                <p className="font-mono text-base whitespace-pre-line">
                    {'SOMETIMES\n\nI GO TO PLACES\nAND TAKE\nDECENT PHOTOGRAPHS'}
                </p>
            </div>
        </div>
    );
}
