import { encodeCode128B, toBarRuns } from './code128';

// a real, scannable code 128 barcode as an svg, 1 unit per module. size it at 1 css px per
// module (width = barcodeWidth(code)) so scanners can read it.
export function barcodeWidth(code: string): number {
    return encodeCode128B(code).length;
}

export default function Barcode({ code }: { code: string }) {
    const modules = encodeCode128B(code);
    return (
        <svg
            viewBox={`0 0 ${modules.length} 1`}
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
            aria-hidden="true"
        >
            {toBarRuns(modules).map(([x, w]) => (
                <rect key={x} x={x} y="0" width={w} height="1" />
            ))}
        </svg>
    );
}
