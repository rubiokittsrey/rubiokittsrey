import { cn } from '@/lib/utils';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { MailIcon } from 'lucide-react';

export default function ContactSection({
    className,
    children,

    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { registerSection } = useScrollSystem();
    const ref = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        return registerSection('contact', el, { icon: MailIcon, title: 'Get In Touch' });
    }, [registerSection]);

    return (
        <section
            id="contact"
            {...props}
            ref={ref}
            className={cn('relative w-full h-[200vh] overflow-hidden', className)}
        >
            <div className="w-full h-[200vh]">
                <div className="h-[calc(100vh-7.5rem)] flex flex-col items-center justify-center">
                    <div className="flex flex-col space-y-2">
                        <h1 className={'font-sans text-7xl font-medium'}>Contact Page</h1>
                        <h2 className="font-sans text-3xl font-extralight"></h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
