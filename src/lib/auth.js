import 'server-only';
import bcrypt from 'bcryptjs';
import { withDB } from '@/lib/mongodb';
import Owner from '@/models/Owner';

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

/**
 * Create an admin account.
 * The first account ever created in an empty collection becomes the owner;
 * everyone after that is a member. Owner status is never granted from input.
 * @param {{ email: string, password: string, name: string }} input
 */
export async function createAdminAccount({ email, password, name }) {
    if (typeof email !== 'string') {
        throw new Error('A valid email address is required');
    }
    const normalizedEmail = normalizeEmail(email);
    if (
        normalizedEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)
    ) {
        throw new Error('A valid email address is required');
    }
    if (
        typeof password !== 'string' ||
        password.length < 12 ||
        Buffer.byteLength(password, 'utf8') > 72
    ) {
        throw new Error('Password must be at least 12 characters and no more than 72 bytes');
    }
    if (typeof name !== 'string' || name.trim().length > 120) {
        throw new Error('Name must be 120 characters or fewer');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return withDB(async () => {
        const ownerExists = await Owner.exists({ role: 'owner' });
        const user = await Owner.create({
            email: normalizedEmail,
            passwordHash,
            name: name.trim(),
            role: ownerExists ? 'member' : 'owner',
        });
        return {
            id: String(user._id),
            email: user.email,
            name: user.name || '',
            role: user.role,
        };
    });
}

/**
 * Verify a plaintext password against an admin account's stored hash.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ id: string, email: string, name: string, role: string } | null>}
 */
export async function verifyCredentials(email, password) {
    if (typeof email !== 'string' || typeof password !== 'string') return null;

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) return null;

    return withDB(async () => {
        const user = await Owner.findOne({ email: normalizedEmail }).select('+passwordHash');
        if (!user || user.active === false) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Update last login timestamp (non-blocking).
        Owner.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } }).catch(() => { });

        return {
            id: String(user._id),
            email: user.email,
            name: user.name || '',
            role: user.role || 'owner',
        };
    });
}

/**
 * Create a member account. Only call from an owner-authorized route.
 * @param {{ email: string, password: string, name: string }} input
 */
export async function createMemberAccount({ email, password, name }) {
    if (typeof email !== 'string') {
        throw new Error('A valid email address is required');
    }
    const normalizedEmail = normalizeEmail(email);
    if (
        normalizedEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)
    ) {
        throw new Error('A valid email address is required');
    }
    if (
        typeof password !== 'string' ||
        password.length < 12 ||
        Buffer.byteLength(password, 'utf8') > 72
    ) {
        throw new Error('Password must be at least 12 characters and no more than 72 bytes');
    }
    if (typeof name !== 'string' || name.trim().length > 120) {
        throw new Error('Name must be 120 characters or fewer');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await withDB(() =>
        Owner.create({
            email: normalizedEmail,
            passwordHash,
            name: name.trim(),
            role: 'member',
        })
    );
    return {
        id: String(user._id),
        email: user.email,
        name: user.name || '',
        role: user.role,
    };
}

export async function listMemberAccounts() {
    return withDB(async () => {
        const users = await Owner.find({ role: 'member' })
            .select('email name role active lastLoginAt')
            .sort({ email: 1 })
            .lean();
        return users.map((user) => ({
            id: String(user._id),
            email: user.email,
            name: user.name || '',
            role: user.role,
            active: user.active !== false,
            lastLoginAt: user.lastLoginAt || null,
        }));
    });
}

export async function deleteMemberAccount(id) {
    if (!id || typeof id !== 'string') return false;
    return withDB(async () => {
        const result = await Owner.deleteOne({ _id: id, role: 'member' });
        return result.deletedCount === 1;
    });
}

/**
 * Fetch an admin account by id for authorization.
 * @param {string} id
 */
export async function getAdminUserById(id) {
    if (!id || typeof id !== 'string') return null;
    return withDB(async () => {
        const user = await Owner.findById(id).lean();
        if (!user || user.active === false) return null;
        return {
            id: String(user._id),
            email: user.email,
            name: user.name || '',
            role: user.role || 'owner',
        };
    });
}