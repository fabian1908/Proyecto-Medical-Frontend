export interface ReseniaResponseDto {
    idResenia: number;
    idDoctor: number;
    calificacion: number;
    comentario: string;
    fechaResenia: string;
}

export interface ReseniaInsertDto {
    idDoctor: number;
    calificacion: number;
    comentario?: string;
}

export interface ReseniaFilterDto {
    idDoctor?: number;
    calificacionMinima?: number;
    calificacionMaxima?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export interface ReseniaUpdateDto {
    calificacion?: number;
    comentario?: string;
}
