import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Photo } from './types';

export default function ExpandDialog({
    photo,
    open,
    onOpenChange,
}: {
    photo: Photo;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/95 backdrop-blur-none" />
                <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none">
                    <DialogPrimitive.Close
                        aria-label="Close"
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        ✕
                    </DialogPrimitive.Close>
                    <img
                        src={photo.url}
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                </DialogPrimitive.Popup>
            </DialogPortal>
        </Dialog>
    );
}
