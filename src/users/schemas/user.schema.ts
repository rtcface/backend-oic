
import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    charge:{
        type: String,
        default: 'Titular',        
    },
    phone:{
        type: String,
    },    
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'contralor'],
        default: 'user',
    },
    createByGoogle: {
        type: Boolean,
        default: false,
    },
    ente_publico: {
        type: Schema.Types.ObjectId,
        ref: 'EntePublico',
    },
    colaboradores: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    firstSignIn: {
        type: Boolean,
        default: false,
    },

});
