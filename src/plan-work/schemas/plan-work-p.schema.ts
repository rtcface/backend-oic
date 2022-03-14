import { Schema } from 'mongoose';

export const PlanWorkPSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    expandedIcon: {
        type: String,
        default: "pi pi-folder-open",
    },
    collapsedIcon: {
        type: String,
        default: "pi pi-folder",
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
    },
    children: [{ type: Schema.Types.ObjectId, ref: 'PlanWorkChild' }],
  
});
