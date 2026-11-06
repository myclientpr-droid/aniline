/**
 * Escape a string for safe use inside a RegExp (Mongo $regex filters).
 * @param {string} s
 */
export function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace Mongoose's ObjectId with its string form.
 *
 * `.lean()` documents still carry a real ObjectId, and React refuses to hand
 * anything with a `toJSON` method to a Client Component. Serialising here keeps
 * the conversion at the data layer, so no page has to remember it.
 * @template T
 * @param {T} value - a document, an array of documents, or null
 * @returns {T}
 */
export function serializeDoc(value) {
    if (Array.isArray(value)) return value.map(serializeDoc);
    if (!value || typeof value !== 'object' || value._id === undefined) return value;
    return { ...value, _id: String(value._id) };
}
