export interface ServicioResponseDto {
    idServicio: number;
    idEspecialidad: number;
    nombre: string;
    descripcion: string;
    riesgos: string;
}

export interface ServicioInsertDto {
    idEspecialidad: number;
    nombre: string;
    descripcion?: string;
    riesgos?: string;
}

export interface ServicioFilterDto {
    idEspecialidad?: number;
    nombre?: string;
}

export interface ServicioUpdateDto {
    idEspecialidad?: number;
    nombre?: string;
    descripcion?: string;
    riesgos?: string;
}
