import mongoose from 'mongoose';
import { PUBLISH_STATUS, TEAM_ROLES } from '@/lib/constants';

const TeamMemberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 120 },
        // Not `required`, and unique only where a slug string exists: rows written before this field
        // carry no `slug` key at all, and a plain unique index would index every one of them as null
        // and fail to build — leaving no enforcement whatsoever.
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            index: { unique: true, partialFilterExpression: { slug: { $type: 'string', $gt: '' } } },
        },
        role: {
            type: String,
            enum: [...TEAM_ROLES, ''],
            default: '',
        },
        bio: { type: String, default: '', trim: true, maxlength: 3000 },
        expertise: { type: [String], default: [] },

        photo: {
            publicId: { type: String, default: '' },
            alt: { type: String, default: '' },
        },

        social: {
            linkedin: { type: String, default: '', trim: true },
            instagram: { type: String, default: '', trim: true },
        },

        order: { type: Number, default: 0, index: true },
        published: {
            type: String,
            enum: Object.values(PUBLISH_STATUS),
            default: PUBLISH_STATUS.DRAFT,
            index: true,
        },
    },
    { timestamps: true }
);

TeamMemberSchema.index({ published: 1, order: 1 });

const TeamMember =
    mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

export default TeamMember;