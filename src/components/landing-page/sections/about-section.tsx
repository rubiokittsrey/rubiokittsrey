import { cn } from '@/lib/utils';
import React, { useLayoutEffect, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { UserRoundIcon } from 'lucide-react';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import { ThresholdScrollAnimation } from '@/components/animations/scroll-animation/types';

export default function AboutSection({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { registerSection } = useScrollSystem();
    const ref = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        return registerSection('about', el, { icon: UserRoundIcon });
    }, [registerSection]);

    const enter: Omit<ThresholdScrollAnimation, 'at'> = {
        key: 'enter',
        mode: 'threshold',
        transitionDuration: 0.3,
        blur: { from: 0.1, to: 0 },
        opacity: { from: 0, to: 1 },
        y: { from: 25, to: 0 },
        ease: 'easeOut',
    };

    const exit: Omit<ThresholdScrollAnimation, 'at'> = {
        key: 'exit',
        mode: 'threshold',
        transitionDuration: 0.3,
        blur: { from: 0, to: 0.1 },
        opacity: { from: 1, to: 0 },
        y: { from: 0, to: -25 },
        ease: 'easeOut',
    };

    return (
        <section
            id="about"
            {...props}
            ref={ref}
            className={cn('relative w-full overflow-clip h-[250vh]', className)}
        >
            <div className="sticky top-0 w-full h-screen flex items-center justify-center p-14 font-sans">
                <ScrollAnimate
                    source="section"
                    sectionId="about"
                    animations={[{ ...(exit as ThresholdScrollAnimation), at: 0.2 }]}
                    // className="flex flex-col space-y-5"
                    className="absolute font-sans max-w-2xl w-full"
                    displayNoneOnInvisible
                >
                    <div className="flex flex-col space-y-5">
                        <p className="text-xl text-center select-none">
                            My name is <b>Kitts Rey Rubio</b>, full-stack developer based in the
                            Philippines. I build interactive applications and software across
                            mobile, web, and IoT platforms.
                        </p>
                    </div>
                </ScrollAnimate>
                <ScrollAnimate
                    className="absolute font-sans max-w-2xl w-full text-center"
                    source="section"
                    sectionId="about"
                    animations={[
                        { ...(enter as ThresholdScrollAnimation), at: 0.2 },
                        { ...(exit as ThresholdScrollAnimation), at: 0.4 },
                    ]}
                    displayNoneOnInvisible
                >
                    <div className="flex flex-col space-y-5 items-center">
                        <p className="text-xl text-center select-none">
                            I have experience building web and mobile applications using WordPress,
                            React, Next.js, Flutter (Dart), Laravel, Django, and Firebase, as well
                            as developing IoT projects with Python on Linux systems, Arduino, and
                            MQTT.
                        </p>
                    </div>
                </ScrollAnimate>
                <ScrollAnimate
                    source="section"
                    sectionId="about"
                    animations={[{ ...(enter as ThresholdScrollAnimation), at: 0.4 }]}
                    className="absolute font-sans max-w-2xl w-full text-center"
                    displayNoneOnInvisible
                >
                    <p className="text-xl text-center select-none">
                        In my free time, I enjoy photography, watching esports, and cooking -
                        literally and figuratively.
                    </p>
                </ScrollAnimate>
            </div>
        </section>
    );
}
