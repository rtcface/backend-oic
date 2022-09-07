import { Schema } from 'mongoose';

export const IntegrityRuleSchema = new Schema({   
    description: {
        type: String,
        required: true,
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
});

export const HistoriRulesSchema = new Schema({   
    ente_publico: {
        type: Schema.Types.ObjectId,
        ref: 'EntePublico',
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
    result: [
        {
            integrity_rule: {
            type: Schema.Types.ObjectId,
            ref: 'IntegrityRule',
            }
        },
        {
            apply: {
            type: Boolean,
            default: false,            
            }
        },
        {
            way:{
                type: String,
                required: false,                
            }
        }
    ]
});