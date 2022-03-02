import { Schema } from 'mongoose';
export const SocialNetworkSchema = new Schema({
    name: {
        type: String,
    },
    icon:{ 
        type: String,
     },
    url: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});