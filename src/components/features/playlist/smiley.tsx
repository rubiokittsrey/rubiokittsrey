import { cn } from '@/lib/utils';
// the gallery's .star class places and sizes it next to the headline at every breakpoint
import g from '@/components/features/gallery/gallery.module.css';
import WireSolid from '@/components/features/gallery/wire-solid';
import styles from './playlist.module.css';

/** the x-eyed grin on a wireframe globe that rocks side to side: takes the headline star's
 * spot (and colour), but not its spin */
export default function Smiley() {
    return (
        <WireSolid className={cn(g.star, styles.smiley)} shape="smiley" turn={10000} sway={38} />
    );
}
