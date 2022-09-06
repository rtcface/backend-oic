import { Schema } from 'mongoose';

export const CodeEthicsSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,

    },
    ente_publico: {
        type: Schema.Types.ObjectId,
        ref: 'EntePublico',
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