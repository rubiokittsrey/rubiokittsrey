import { HolographicCard } from '@/components/graphics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'contact',
};

export default function ContactPage() {
    return (
        <div className="w-full h-full rounded-4xl flex justify-between font-sans">
            <h3 className="text-3xl font-mono">://{metadata.title?.toString().toUpperCase()}</h3>
        </div>
    );
}
