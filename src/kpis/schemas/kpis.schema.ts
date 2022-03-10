import { Schema } from 'mongoose';

export const KpisSchema = new Schema({
    kpi: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    total_casos: {
        type: Number,
        required: true,
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
    ente_publico: {
        type: Schema.Types.ObjectId,
        ref: 'EntePublico',
    },
    
});
