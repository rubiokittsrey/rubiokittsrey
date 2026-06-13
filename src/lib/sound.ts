const EXPAND = '/sounds/expand.wav';
const MINIMIZE = '/sounds/minimize.wav';
const KEY = '/sounds/key.wav';

const KEY_PITCH_RANGE = 0.15;

const clips: Record<string, HTMLAudioElement> = {};
function playClip(src: string) {
    if (typeof window === 'undefined') return;
    let clip = clips[src];
    if (!clip) {
        clip = new Audio(src);
        clip.preload = 'auto';
        clips[src] = clip;
    }
    clip.currentTime = 0;
    void clip.play().catch(() => {});
}

export function playExpand() {
    playClip(EXPAND);
}

export function playMinimize() {
    playClip(MINIMIZE);
}

let keyBase: HTMLAudioElement | null = null;
export function playKey() {
    if (typeof window === 'undefined') return;
    if (!keyBase) {
        keyBase = new Audio(KEY);
        keyBase.preload = 'auto';
    }
    const tap = keyBase.cloneNode(true) as HTMLAudioElement;
    tap.playbackRate = 1 + (Math.random() * 2 - 1) * KEY_PITCH_RANGE;
    void tap.play().catch(() => {});
}
