import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'aniline_session';
const SESSION_DAYS = 7;
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function getSecret() {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('AUTH_SECRET must be set and at least 32 characters');
    }
    return new TextEncoder().encode(secret);
}

/**
 * Sign a session JWT for an admin user.
 * @param {{ id: string, email: string, role: 'owner' | 'member' }} payload
 * @returns {Promise<string>}
 */
export async function signSession(payload) {
    return new SignJWT({
        sub: payload.id,
        email: payload.email,
        role: payload.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DAYS}d`)
        .sign(getSecret());
}

/**
 * Verify a session JWT. Returns null if invalid or expired.
 * @param {string} token
 * @returns {Promise<{ id: string, email: string, role: 'owner' | 'member' } | null>}
 */
export async function verifySession(token) {
    if (!token || typeof token !== 'string') return null;
    try {
        const { payload } = await jwtVerify(token, getSecret(), {
            algorithms: ['HS256'],
        });
        if (
            typeof payload.sub !== 'string' ||
            typeof payload.email !== 'string' ||
            (payload.role !== undefined &&
                payload.role !== 'owner' &&
                payload.role !== 'member')
        ) {
            return null;
        }
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role || 'owner',
        };
    } catch {
        return null;
    }
}

/**
 * Session cookie options. Used by the login/logout routes.
 */
export const SESSION_COOKIE = {
    name: COOKIE_NAME,
    maxAge: SESSION_SECONDS,
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_SECONDS,
    },
};

export async function getCurrentUser() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE.name)?.value;
    if (!token) return null;
    return verifySession(token);
}