import { Schema } from "mongoose";

export const PlanWorkGpSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    expandedIcon: {
        type: String,
        default: "pi pi-folder-open",
    },
    collapsedIcon: {
        type: String,
        default: "pi pi-folder",
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
    children: [{ type: Schema.Types.ObjectId, ref: 'PlanWorkParent' }],

    

});



export interface PlaneWork {
    data?: Datum[];
}

export interface Datum {
    label?:         string;
    data?:          string;
    expandedIcon?:  string;
    collapsedIcon?: string;
    children?:      DatumChild[];
}

export interface DatumChild {
    label?:         string;
    data?:          string;
    expandedIcon?:  string;
    collapsedIcon?: string;
    children?:      ChildChild[];
}

export interface ChildChild {
    label?:      string;
    icon?:       string;
    routerLink?: string;
    data?:       string;
}
