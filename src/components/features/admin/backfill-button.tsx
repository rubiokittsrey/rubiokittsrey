'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import styles from './admin.module.css';
import { backfillDerivatives } from '@/lib/album/actions';

/**
 * generates missing image derivatives (incl. the 2048px display size) for every album,
 * a small batch per request so no single call runs long.
 */
export function BackfillButton() {
    const [pending, start] = useTransition();
    const [status, setStatus] = useState<string | null>(null);

    const run = () =>
        start(async () => {
            let done = 0;
            let skip = 0;
            try {
                for (;;) {
                    const r = await backfillDerivatives(skip);
                    done += r.done;
                    skip += r.failed;
                    setStatus(`${done} done · ${skip} failed · ${r.remaining} left`);
                    if (r.remaining === 0 || r.done + r.failed === 0) break;
                }
                setStatus(`finished: ${done} done · ${skip} failed`);
            } catch (err) {
                setStatus(`error: ${err instanceof Error ? err.message : String(err)}`);
            }
        });

    return (
        <div className={styles.backfill}>
            {status && (
                <span className={cn(styles.meta)} role="status">
                    {status}
                </span>
            )}
            <button type="button" disabled={pending} onClick={run} className={styles.btn}>
                {pending ? 'regenerating…' : 'regenerate images'}
            </button>
        </div>
    );
}
