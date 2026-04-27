import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Photo } from './types';

export default function ThumbnailStrip({
    photographs,
    selected,
    onSelect,
}: {
    photographs: Photo[];
    selected: number;
    onSelect: (idx: number) => void;
}) {
    return (
        <div className="shrink-0 w-full flex space-x-5 pt-6 border-t dark:border-surface-foreground/10 border-surface-foreground/15 overflow-x-auto">
            {photographs.map((p, idx) => (
                <button
                    key={p.id}
                    onClick={() => onSelect(idx)}
                    className={cn(
                        'transition-opacity cursor-pointer shrink-0',
                        idx === selected ? 'opacity-100' : 'opacity-50'
                    )}
                >
                    <Image
                        className="max-h-10 sm:max-h-15 w-auto shrink-0"
                        src={p.url}
                        alt={p.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                    />
                </button>
            ))}
        </div>
    );
}
