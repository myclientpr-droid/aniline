import mongoose from 'mongoose';
import { PHOTOGRAPHY_CATEGORIES, PHOTO_GRID_SHAPES, PUBLISH_STATUS } from '@/lib/constants';

const PhotoSchema = new mongoose.Schema(
    {
        title: { type: String, default: '', trim: true, maxlength: 200 },
        category: {
            type: String,
            enum: [...PHOTOGRAPHY_CATEGORIES, ''],
            default: '',
            index: true,
        },
        publicId: { type: String, required: true, trim: true },
        alt: { type: String, default: '', trim: true, maxlength: 300 },
        caption: { type: String, default: '', trim: true, maxlength: 500 },
        location: { type: String, default: '', trim: true, maxlength: 160 },
        width: { type: Number, min: 1 },
        height: { type: Number, min: 1 },
        // '' means "derive the tile shape from width/height".
        gridShape: { type: String, enum: [...PHOTO_GRID_SHAPES, ''], default: '' },
        year: { type: Number, min: 2000, max: 2100 },
        order: { type: Number, default: 0 },
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

PhotoSchema.index({ published: 1, category: 1, order: 1, createdAt: -1 });

const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

export default Photo;