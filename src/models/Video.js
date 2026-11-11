import mongoose from 'mongoose';
import {
    PUBLISH_STATUS,
    PROJECT_VIDEO_ASPECT_RATIOS,
    VIDEO_CATEGORIES,
} from '@/lib/constants';

const PosterSchema = new mongoose.Schema(
    {
        publicId: { type: String, required: true, trim: true },
        alt: { type: String, default: '', trim: true, maxlength: 300 },
        caption: { type: String, default: '', trim: true, maxlength: 500 },
        width: { type: Number, min: 1 },
        height: { type: Number, min: 1 },
    },
    { _id: false }
);

const VideoSchema = new mongoose.Schema(
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
            enum: [...VIDEO_CATEGORIES, ''],
            default: '',
            index: true,
        },

        client: { type: String, default: '', trim: true, maxlength: 160 },
        location: { type: String, default: '', trim: true, maxlength: 160 },
        year: { type: Number, min: 2000, max: 2100, index: true },

        // The playable source. Links only — a film lives on YouTube or Vimeo, and the poster below
        // is the only asset uploaded here.
        videoUrl: { type: String, required: true, trim: true, maxlength: 2048 },
        aspectRatio: {
            type: String,
            enum: [...PROJECT_VIDEO_ASPECT_RATIOS, ''],
            default: PROJECT_VIDEO_ASPECT_RATIOS[0],
        },
        // null, not undefined: updateVideo() $sets the validated object and BSON drops undefined
        // keys, so an owner could never clear a mistyped duration.
        durationSeconds: { type: Number, min: 1, max: 86400, default: null },

        poster: { type: PosterSchema, default: null },

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

// The public sort runs featured-first, so the index has to match it or every page load sorts in memory.
VideoSchema.index({ published: 1, featured: -1, year: -1, createdAt: -1 });
VideoSchema.index({ published: 1, category: 1, year: -1 });

// Reuse model across hot reloads
const Video =
    mongoose.models.Video || mongoose.model('Video', VideoSchema);

export default Video;
