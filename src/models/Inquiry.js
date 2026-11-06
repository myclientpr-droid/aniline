import mongoose from 'mongoose';
import { INQUIRY_STATUS, PROJECT_CATEGORIES } from '@/lib/constants';

const InquirySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 120 },
        organization: { type: String, default: '', trim: true, maxlength: 160 },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        },
        phone: { type: String, default: '', trim: true, maxlength: 32 },

        projectCategory: {
            type: String,
            required: true,
            enum: PROJECT_CATEGORIES,
        },
        location: { type: String, default: '', trim: true, maxlength: 160 },
        preferredDate: { type: String, default: '', trim: true, maxlength: 40 },
        timeline: { type: String, default: '', trim: true, maxlength: 120 },
        description: { type: String, required: true, trim: true, maxlength: 5000 },
        referenceLinks: { type: [String], default: [] },

        status: {
            type: String,
            enum: Object.values(INQUIRY_STATUS),
            default: INQUIRY_STATUS.NEW,
            index: true,
        },
    },
    { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry =
    mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry;