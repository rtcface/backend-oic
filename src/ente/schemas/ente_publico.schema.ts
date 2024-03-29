import { Schema } from 'mongoose';

export const EntePublicoSchema = new Schema({
    nombre_ente: {
        type: String,
        required: true,
    },
    siglas_ente: {
        type: String,
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
    }
});