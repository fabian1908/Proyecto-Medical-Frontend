export interface RecetaResponseDto {
    idReceta: number;
    idCita: number;
    descripcion: string;
    fechaReceta: string;
    nombreDoctor: string;
    nombrePaciente: string;
    motivoCita: string;
}

export interface RecetaInsertDto {
    idCita: number;
    descripcion: string;
}

export interface RecetaFilterDto {
    idCita?: number;
    fechaRecetaInicio?: string;
    fechaRecetaFin?: string;
    descripcionContiene?: string;
}

export interface RecetaUpdateDto {
    descripcion: string;
}
