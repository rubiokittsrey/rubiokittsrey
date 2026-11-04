// the barcode is drawn at 1 css px per module, so its width is set by the text length:
// code 128 B = start (11) + 11 per char + checksum (11) + stop (13).
export const BARCODE_MAX_WIDTH = 300;
const MAX_CHARS = Math.floor((BARCODE_MAX_WIDTH - 35) / 11); // 24

const CREDIT = /\s*[([](?:feat\.?|ft\.?|with)\s[^)\]]*[)\]]/gi; // "(feat. x)", "[with y]"
const REMASTER = /\s+-\s+[^-]*remaster[^-]*$/i; // " - remastered 2011"

// code 128 B only covers printable ascii: fold accents and typographic punctuation, drop the rest
function toAscii(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[–—]/g, '-')
        .replace(/…/g, '...')
        .replace(/[^\x20-\x7e]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// track title → barcode text that fits BARCODE_MAX_WIDTH. too-long titles become their
// acronym ("Everything In Its Right Place" → "EIIRP"). '' if nothing encodable is left.
export function toBarcodeText(title: string): string {
    const text = toAscii(title.replace(CREDIT, '').replace(REMASTER, ''));
    if (text.length <= MAX_CHARS) return text;

    const words = text.split(' ');
    if (words.length === 1) return text.slice(0, MAX_CHARS); // one long word: no acronym to make

    return words
        .map((word) => word.match(/[a-z0-9]/i)?.[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, MAX_CHARS);
}
