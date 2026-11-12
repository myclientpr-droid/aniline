import { Loader2 } from 'lucide-react';

/**
 * Decorative by design: the surrounding control carries the accessible state
 * (`aria-busy` plus a label change), so a spinner announced on every button would
 * only add noise.
 * @param {{ className?: string }} props
 */
export default function Spinner({ className = 'h-4 w-4' }) {
    return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />;
}
