export interface DiagnosticoResponseDto {
    idDiagnostico: number;
    idCita: number;
    descripcion: string;
    fechaDiagnostico: string;
}

export interface DiagnosticoInsertDto {
    idCita: number;
    descripcion: string;
}

export interface DiagnosticoFilterDto {
    idDiagnostico?: number;
    idCita?: number;
    fechaDiagnosticoInicio?: string;
    fechaDiagnosticoFin?: string;
}

export interface DiagnosticoUpdateDto {
    descripcion?: string;
}
