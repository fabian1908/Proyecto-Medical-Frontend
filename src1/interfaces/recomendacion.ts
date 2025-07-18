export interface RecomendacionResponseDto {
    idRecomendacion: number;
    idCita: number;
    descripcion: string;
    fechaRecomendacion: string;
    nombreDoctor: string;
    nombrePaciente: string;
    motivoCita: string;
}

export interface RecomendacionInsertDto {
    idCita: number;
    descripcion: string;
}

export interface RecomendacionFilterDto {
    idCita?: number;
    fechaRecomendacionInicio?: string;
    fechaRecomendacionFin?: string;
    descripcionContiene?: string;
}

export interface RecomendacionUpdateDto {
    descripcion: string;
}
