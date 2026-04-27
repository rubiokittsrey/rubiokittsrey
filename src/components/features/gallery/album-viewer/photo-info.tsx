import { Photo, ImgBox } from './types';
import { formatDate, toDMS } from './format';

export default function PhotoInfo({ photo, imgBox }: { photo: Photo; imgBox: ImgBox }) {
    return (
        <div
            className="absolute pointer-events-none bg-linear-to-t from-black/60 via-black/20 to-transparent"
            style={{
                left: imgBox.left,
                top: imgBox.top + imgBox.height * 0.6,
                width: imgBox.width,
                height: imgBox.height * 0.4,
            }}
        >
            <div className="absolute bottom-6 left-6 font-mono text-xs text-white space-y-1">
                {photo.description && <p className="text-white/70">{photo.description}</p>}
                {photo.date && <p className="text-white/50">{formatDate(photo.date)}</p>}
                {photo.coordinates && (
                    <div className="flex space-x-5 text-white/50">
                        <p>{toDMS(photo.coordinates.lat, 'N', 'S')}</p>
                        <p>{toDMS(photo.coordinates.lng, 'E', 'W')}</p>
                    </div>
                )}
                <p className="text-lg font-medium mt-3">{photo.title}</p>
            </div>
        </div>
    );
}
