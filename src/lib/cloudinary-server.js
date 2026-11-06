import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    // Warn only. Route handlers that call this will throw below.
    console.warn('[cloudinary-server] Missing Cloudinary server credentials');
}

/**
 * Generate a signed upload payload for direct client uploads.
 * The public ID is generated here so the browser can never overwrite an
 * existing asset with a client-chosen public ID. The folder is baked into the
 * public ID, so the client must not send a `folder` param alongside it —
 * Cloudinary prepends it and the asset lands one level too deep.
 * Call only from a route handler or server action.
 * @param {object} [opts]
 * @param {string} [opts.folder='aniline/uploads']
 * @param {string} [opts.publicId] - Full public ID (folder-prefixed). Generated when omitted.
 * @returns {{ publicId: string, timestamp: number, signature: string, apiKey: string, cloudName: string }}
 */
export function generateUploadSignature(opts = {}) {
    const { folder = 'aniline/uploads' } = opts;

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw new Error('Cloudinary server credentials not configured');
    }

    const leaf = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const publicId = opts.publicId || `${folder}/${leaf}`;

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { public_id: publicId, timestamp };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, API_SECRET);

    return { publicId, timestamp, signature, apiKey: API_KEY, cloudName: CLOUD_NAME };
}