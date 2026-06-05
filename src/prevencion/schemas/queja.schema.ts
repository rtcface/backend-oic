import { Schema } from 'mongoose';

export const QuejaSchema = new Schema({
  procedentes: {
    type: Number,
    required: true,
    min: 0,
  },
  improcedentes: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  ente_publico: {
    type: Schema.Types.ObjectId,
    ref: 'EntePublico',
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});
