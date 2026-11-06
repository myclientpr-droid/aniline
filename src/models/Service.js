import mongoose from 'mongoose';
import { PUBLISH_STATUS } from '@/lib/constants';

const ServiceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 160 },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        },
        shortDescription: { type: String, default: '', trim: true, maxlength: 300 },
        description: { type: String, default: '', trim: true, maxlength: 10000 },

        audience: { type: [String], default: [] },
        deliverables: { type: [String], default: [] },

        heroImage: {
            publicId: { type: String, default: '' },
            alt: { type: String, default: '' },
        },

        order: { type: Number, default: 0, index: true },
        published: {
            type: String,
            enum: Object.values(PUBLISH_STATUS),
            default: PUBLISH_STATUS.DRAFT,
            index: true,
        },

        seoTitle: { type: String, default: '', trim: true, maxlength: 200 },
        seoDescription: { type: String, default: '', trim: true, maxlength: 320 },
    },
    { timestamps: true }
);

ServiceSchema.index({ published: 1, order: 1 });

const Service =
    mongoose.models.Service || mongoose.model('Service', ServiceSchema);

export default Service;