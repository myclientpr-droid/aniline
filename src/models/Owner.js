import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        },
        passwordHash: { type: String, required: true, select: false },
        name: { type: String, default: '', trim: true, maxlength: 120 },
        role: {
            type: String,
            enum: ['owner', 'member'],
            default: 'member',
        },
        active: { type: Boolean, default: true },
        lastLoginAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Owner = mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);

export default Owner;