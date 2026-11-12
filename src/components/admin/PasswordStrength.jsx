import { Check, Minus } from 'lucide-react';
import { passwordChecks, passwordScore } from '@/lib/authValidation';

// Literal strings for both axes: Tailwind v4 only emits classes it can see in source.
const SCORE_LABEL = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent'];
const BAR_ON = ['bg-red-400', 'bg-red-400', 'bg-orange', 'bg-emerald-400', 'bg-emerald-400'];

/**
 * Advisory only — it never blocks submission. The hard 12-character / 72-byte rules live in
 * `validateAccount`, which mirrors the server.
 * @param {{ id: string, value: string }} props
 */
export default function PasswordStrength({ id, value }) {
    const score = passwordScore(value);
    const checks = passwordChecks(value);

    return (
        <div id={`${id}-strength`} className="mt-3">
            <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((index) => (
                        <span
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                                index < score ? BAR_ON[score] : 'bg-white/12'
                            }`}
                        />
                    ))}
                </div>
                <p
                    className={`flex-none text-xs font-semibold ${
                        score >= 3 ? 'text-emerald-300' : score === 2 ? 'text-orange' : 'text-white/60'
                    }`}
                    role="status"
                >
                    {SCORE_LABEL[score]}
                </p>
            </div>

            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {checks.map((check) => (
                    <li
                        key={check.id}
                        className={`flex items-center gap-1 text-[0.7rem] transition-colors duration-200 ${
                            check.met ? 'text-emerald-300' : 'text-white/35'
                        }`}
                    >
                        {check.met ? (
                            <Check className="h-3 w-3" aria-hidden="true" />
                        ) : (
                            <Minus className="h-3 w-3" aria-hidden="true" />
                        )}
                        {check.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
