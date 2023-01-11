

export interface Data {
    labels:string[],
    datasets:Config[]
}

export interface Config{
    label: string,
    backgroundColor: string[],
    data: number[]
}

export interface DataHistory {
    ente_publico:{
        nombre_ente: string
    },
    porcentaje: number
}