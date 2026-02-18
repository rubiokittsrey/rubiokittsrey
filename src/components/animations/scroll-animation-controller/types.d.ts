export type ScrollProgressSource = 'page' | 'section';
export type AnimatableProperty = 'x' | 'y' | 'opacity' | 'scale' | 'rotation';

export type PropertyRange = {
    from: number;
    to: number;
};

export type ProgressWindow = {
    from: number;
    to: number;
};

export interface ScrollAnimationBase {
    key: string;
    mode: 'range' | 'threshold';
    x?: PropertyRange;
    y?: PropertyRange;
    opacity?: PropertyRange;
    scale?: PropertyRange;
    rotation?: PropertyRange;
    transformOrigin?: string;
    ease?: Easing;
}

export interface RangeScrollAnimation extends ScrollAnimationBase {
    mode: 'range';
    window: ProgressWindow;
    interpolation?: 'linear' | 'ease';
}

export interface ThresholdScrollAnimation extends ScrollAnimationBase {
    mode: 'threshold';
    // normalized [0..1]
    at: number;
    transitionDuration: number;
    snap?: boolean; // skip animation and snap directly
}

export type ScrollAnimation = RangeScrollAnimation | ThresholdScrollAnimation;

type PropertyCommitState = {
    value: number;
    /** The progress point at which this value was last committed */
    atProgress: number;
};

type PropertyResolutionContext = Record<AnimatableProperty, PropertyCommitState>;

export interface ResolvedPropertyState {
    value: number;
    transition?: {
        duration: number;
        ease: Easing;
    };
    cacheKey: string;
}

export type ResolvedAnimationState = Record<AnimatableProperty, ResolvedPropertyState> & {
    transformOrigin?: string;
};

export interface ScrollAnimateProps {
    source?: ScrollProgressSource;
    sectionId?: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    disablePointerOnInvisible?: boolean;
    animations: ScrollAnimation[];
}
