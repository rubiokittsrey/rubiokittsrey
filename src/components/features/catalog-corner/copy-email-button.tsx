'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './catalog-corner.module.css';

const COPIED_MS = 1600;

function copyFallback(text: string) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
    } catch {
        // nothing else to fall back to
    }
    document.body.removeChild(ta);
}

export default function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const done = () => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    };

    const handleClick = () => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(email).then(done, done);
        } else {
            copyFallback(email);
            done();
        }
    };

    return (
        <>
            <button
                className={styles.copy}
                type="button"
                aria-label="Copy email address"
                onClick={handleClick}
            >
                {copied ? (
                    <span>copied</span>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <rect
                            x="5.5"
                            y="5.5"
                            width="8"
                            height="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                        <path
                            d="M10.5 3.5V2.5H2.5V10.5H3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                    </svg>
                )}
            </button>
            <span className="sr-only" role="status">
                {copied ? 'Email address copied' : ''}
            </span>
        </>
    );
}
