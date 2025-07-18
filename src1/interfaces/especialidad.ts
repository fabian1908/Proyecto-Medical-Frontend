export interface EspecialidadResponseDto {
    idEspecialidad: number;
    nombre: string;
    descripcion: string;
}

export interface EspecialidadInsertDto {
    nombre: string;
    descripcion?: string;
}

export interface EspecialidadFilterDto {
    idEspecialidad?: number;
    nombre?: string;
    descripcionContiene?: string;
}

export interface EspecialidadUpdateDto {
    nombre?: string;
    descripcion?: string;
}
