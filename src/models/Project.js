import mongoose from 'mongoose';
import {
    PROJECT_CATEGORIES,
    PROJECT_VIDEO_ASPECT_RATIOS,
    PUBLISH_STATUS,
} from '@/lib/constants';

const MediaSchema = new mongoose.Schema(
    {
        publicId: { type: String, required: true, trim: true },
        alt: { type: String, default: '', trim: true, maxlength: 300 },
        caption: { type: String, default: '', trim: true, maxlength: 500 },
        width: { type: Number, min: 1 },
        height: { type: Number, min: 1 },
    },
    { _id: false }
);

const ProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        },
        shortDescription: { type: String, default: '', trim: true, maxlength: 300 },
        fullDescription: { type: String, default: '', trim: true, maxlength: 20000 },

        category: {
            type: String,
            enum: [...PROJECT_CATEGORIES, ''],
            default: '',
            index: true,
        },

        client: { type: String, default: '', trim: true, maxlength: 160 },
        location: { type: String, default: '', trim: true, maxlength: 160 },
        year: { type: Number, min: 2000, max: 2100, index: true },

        featuredImage: { type: MediaSchema, default: null },
        gallery: { type: [MediaSchema], default: [] },

        videoUrl: { type: String, default: '', trim: true },
        videoPublicId: { type: String, default: '', trim: true },
        videoAspectRatio: {
            type: String,
            enum: [...PROJECT_VIDEO_ASPECT_RATIOS, ''],
            default: PROJECT_VIDEO_ASPECT_RATIOS[0],
        },

        servicesProvided: { type: [String], default: [] },

        featured: { type: Boolean, default: false, index: true },
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

// Compound index for the most common list query:
// published + featured sort + year sort
ProjectSchema.index({ published: 1, featured: -1, year: -1, createdAt: -1 });
ProjectSchema.index({ published: 1, category: 1, year: -1 });

// Reuse model across hot reloads
const Project =
    mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;