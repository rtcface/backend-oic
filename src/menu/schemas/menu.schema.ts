import { Schema } from 'mongoose';
export  const MenuSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    routerLink: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'contralor'],
        default: 'user',
    },
    portal: {
        type: String,
        enum: ['oic', 'plt'],
        default: 'oic',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    order: {
        type: Number,
        default: 0,
    },
});


