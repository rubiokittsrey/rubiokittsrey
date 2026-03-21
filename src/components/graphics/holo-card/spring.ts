export interface SpringState {
    x: number;
    y: number;
}

export interface SpringOptions {
    stiffness: number;
    damping: number;
}

export function createSpring(initial: SpringState, opts: SpringOptions) {
    let current = { ...initial };
    let target = { ...initial };
    let velocity = { x: 0, y: 0 };
    let stiffness = opts.stiffness;
    let damping = opts.damping;
    let rafId: number | null = null;
    let listeners: Array<(v: SpringState) => void> = [];

    const notify = () => listeners.forEach((l) => l({ ...current }));

    const tick = () => {
        const fx = (target.x - current.x) * stiffness;
        const fy = (target.y - current.y) * stiffness;
        velocity.x = (velocity.x + fx) * (1 - damping);
        velocity.y = (velocity.y + fy) * (1 - damping);
        current.x += velocity.x;
        current.y += velocity.y;

        const settled =
            Math.abs(velocity.x) < 0.001 &&
            Math.abs(velocity.y) < 0.001 &&
            Math.abs(target.x - current.x) < 0.001 &&
            Math.abs(target.y - current.y) < 0.001;

        notify();
        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            current = { ...target };
            velocity = { x: 0, y: 0 };
            notify();
            rafId = null;
        }
    };

    return {
        get value() {
            return { ...current };
        },
        get isSettled() {
            return rafId === null;
        },
        set(next: SpringState, o?: { hard?: boolean; soft?: boolean }) {
            target = { ...next };
            if (o?.hard) {
                current = { ...next };
                velocity = { x: 0, y: 0 };
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                notify();
                return;
            }
            if (rafId === null) rafId = requestAnimationFrame(tick);
        },
        setOpts(o: Partial<SpringOptions>) {
            if (o.stiffness !== undefined) stiffness = o.stiffness;
            if (o.damping !== undefined) damping = o.damping;
        },
        subscribe(fn: (v: SpringState) => void) {
            listeners.push(fn);
            fn({ ...current });
            return () => {
                listeners = listeners.filter((l) => l !== fn);
            };
        },
        destroy() {
            if (rafId !== null) cancelAnimationFrame(rafId);
            listeners = [];
        },
    };
}

export function createScalarSpring(initial: number, opts: SpringOptions) {
    const inner = createSpring({ x: initial, y: 0 }, opts);
    return {
        get value() {
            return inner.value.x;
        },
        set(v: number, o?: { hard?: boolean; soft?: boolean }) {
            inner.set({ x: v, y: 0 }, o);
        },
        setOpts: inner.setOpts.bind(inner),
        subscribe(fn: (v: number) => void) {
            return inner.subscribe((s) => fn(s.x));
        },
        destroy: inner.destroy.bind(inner),
    };
}
