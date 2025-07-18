export interface ConsultorioResponseDto {
    idConsultorio: number;
    ruc: string;
    nombre: string;
    latitud: number;
    longitud: number;
    direccion: string;
    telefono: string;
}

export interface ConsultorioInsertDto {
    ruc: string;
    nombre: string;
    latitud: number;
    longitud: number;
    direccion?: string;
    telefono?: string;
}

export interface ConsultorioFilterDto {
    nombre?: string;
    latitud?: number;
    longitud?: number;
    ruc?: string;
}

export interface ConsultorioUpdateDto {
    ruc?: string;
    nombre?: string;
    longitud?: number;
    latitud?: number;
    direccion?: string;
    telefono?: string;
}
