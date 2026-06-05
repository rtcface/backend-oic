import { Schema } from 'mongoose';

export const ActividadSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
    default: '',
  },
  evidencias: [{
    titulo: { type: String, required: true },
    archivo: { type: String, required: true }, // URL or Base64 string representing the file
  }],
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
