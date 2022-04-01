import { Schema } from 'mongoose';

export const PlanWorkChSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        default: "#",
    },
    icon: {
        type: String,
        default: "pi pi-file",
    },  
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'active',
    }
});
