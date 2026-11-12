/**
 * Client-side mirror of the account rules enforced in src/lib/auth.js and
 * src/app/api/auth/signup/route.js. The server stays authoritative — this exists so a
 * mistake surfaces on the field while it is being typed instead of after a round trip.
 * Change one, change the other.
 *
 * Safe for the browser: no `server-only` import, no `Buffer`.
 */

import { isEmail } from '@/lib/validators';

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_BYTES = 72;
export const NAME_MAX_LENGTH = 120;

/** UTF-8 byte length, which is what bcrypt actually caps at. */
export function byteLength(value) {
    return new TextEncoder().encode(value ?? '').length;
}

export function passwordChecks(value) {
    const password = value ?? '';
    return [
        { id: 'length', label: '12 characters', met: password.length >= PASSWORD_MIN_LENGTH },
        { id: 'case', label: 'Upper and lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { id: 'number', label: 'A number', met: /\d/.test(password) },
        { id: 'symbol', label: 'A symbol', met: /[^\w\s]/.test(password) },
    ];
}

/** 0–4. Deliberately independent of the hard rules: strength is advisory, validity is not. */
export function passwordScore(value) {
    return passwordChecks(value).filter((check) => check.met).length;
}

function emailError(email) {
    if (!email) return 'Enter your email address.';
    if (!isEmail(email)) return 'Enter a valid email address.';
    return null;
}

/**
 * Sign-in only checks that a credential was supplied. The length and byte rules are creation
 * policy: applying them here would lock out any account created before the 12-character
 * minimum existed, because the server never re-checks policy at login.
 * @param {{ email: string, password: string }} values
 * @returns {Record<string, string>} field → message, empty when valid
 */
export function validateCredentials({ email, password }) {
    const errors = {};

    const emailProblem = emailError(email ?? '');
    if (emailProblem) errors.email = emailProblem;

    if (!password) errors.password = 'Enter your password.';

    return errors;
}

/**
 * A field is checked only when its key is present, so callers pass just the fields they collect.
 * @param {{ name?: string, email?: string, password?: string }} values
 * @returns {Record<string, string>} field → message, empty when valid
 */
export function validateAccount(values) {
    const errors = {};

    if ('name' in values) {
        const name = values.name ?? '';
        if (!name.trim()) {
            errors.name = 'Enter your name.';
        } else if (name.length > NAME_MAX_LENGTH) {
            errors.name = `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
        }
    }

    const emailProblem = emailError(values.email ?? '');
    if (emailProblem) errors.email = emailProblem;

    if ('password' in values) {
        const password = values.password ?? '';
        if (!password) {
            errors.password = 'Choose a password.';
        } else if (password.length < PASSWORD_MIN_LENGTH) {
            errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
        } else if (byteLength(password) > PASSWORD_MAX_BYTES) {
            errors.password = `Password must be no more than ${PASSWORD_MAX_BYTES} bytes.`;
        }
    }

    return errors;
}
