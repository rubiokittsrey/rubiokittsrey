import { GlobeWireIcon } from '@/assets/icons';
import { Label } from '@/components/ui/label';

export default function AboutMeBlurb() {
    return (
        <div className="grid grid-cols-3 gap-15 w-ful font-mono whitespace-pre-wrap">
            <div className="flex flex-col space-y-2">
                <p>{'I AM A\nSOFTWARE DEVELOPER FROM\nTHE PHILIPPINES'}</p>
                <Label>01</Label>
            </div>
            <div className="flex flex-col space-y-2">
                <p>{'I ENJOY BUILDING,\nDESIGNING\nAND CREATING THINGS'}</p>
                <Label>02</Label>
            </div>
            <div className="flex flex-col space-y-2">
                <p>{'SOMETIMES\nI GO TO PLACES AND TAKE\nDECENT PHOTOGRAPHS'}</p>
                <Label>03</Label>
            </div>
        </div>
    );
}
