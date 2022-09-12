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
    order:{
        type: Number,
        default: 0
    },
});

export const HistoryRulesSchema = new Schema({   
    ente_publico: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
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
    p1: { type: Boolean, default: false},
    p2: { type: Boolean, default: false},
    p3: { type: Boolean, default: false},
    p4: { type: Boolean, default: false},
    p5: { type: Boolean, default: false},
    p6: { type: Boolean, default: false},
    p7: { type: Boolean, default: false},
    p8: { type: Boolean, default: false},
    p9: { type: Boolean, default: false},
    p10: { type: Boolean, default: false},
    p11: { type: Boolean, default: false},
    p12: { type: Boolean, default: false},
    p13: { type: Boolean, default: false},
    p14: { type: Boolean, default: false},
    p15: { type: Boolean, default: false},
    p16: { type: Boolean, default: false}

});
