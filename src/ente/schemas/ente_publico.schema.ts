import { Schema } from 'mongoose';

export const EntePublicoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    siglas: {
        type: String,
        required: true,

    }
});