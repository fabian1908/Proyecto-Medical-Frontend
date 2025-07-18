export interface PersonaResponseDto {
    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
    celular: string;
    direccion: string;
    fechaNacimiento: string;
}

export interface PersonaInsertDto {
    dni: string;
    nombres: string;
    apellidos: string;
    celular?: string;
    direccion?: string;
    fechaNacimiento?: string;
}

export interface PersonaFilterDto {
    dni?: string;
    nombres?: string;
    apellidos?: string;
    fechaNacimiento?: string;
}

export interface PersonaUpdateDto {
    nombres: string;
    apellidos: string;
    celular: string;
    direccion?: string;
    fechaNacimiento?: string;
}
