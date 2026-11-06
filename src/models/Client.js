import mongoose from 'mongoose';
import { PUBLISH_STATUS, CLIENT_TYPES } from '@/lib/constants';

const ClientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 200 },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        },
        shortDescription: { type: String, default: '', trim: true, maxlength: 300 },

        // Client type — broad category for filtering / display grouping
        type: {
            type: String,
            enum: [...CLIENT_TYPES, ''],
            default: '',
            index: true,
        },

        // Location (optional)
        location: { type: String, default: '', trim: true, maxlength: 160 },

        // Visual
        logo: {
            publicId: { type: String, default: '' },
            alt: { type: String, default: '' },
        },

        // External link (client's site), optional and only if approved
        website: { type: String, default: '', trim: true, maxlength: 500 },

        // Optional ordering for display
        order: { type: Number, default: 0, index: true },

        // Featured on homepage or elsewhere if desired
        featured: { type: Boolean, default: false, index: true },

        published: {
            type: String,
            enum: Object.values(PUBLISH_STATUS),
            default: PUBLISH_STATUS.DRAFT,
            index: true,
        },
    },
    { timestamps: true }
);

ClientSchema.index({ published: 1, type: 1, order: 1, name: 1 });
ClientSchema.index({ published: 1, featured: -1, order: 1 });

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

export default Client;