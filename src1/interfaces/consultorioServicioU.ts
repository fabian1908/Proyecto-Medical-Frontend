export interface ConsultorioServicioUResponseDto {
    idConsultorioServicioU: number;
    idUsuario: number;
    idConsultorio: number;
    idServicio: number;
}

export interface ConsultorioServicioUInsertDto {
    idUsuario: number;
    idConsultorio: number;
    idServicio: number;
}

export interface FilterConsultorioServicioUDto {
    idUsuario?: number;
    idConsultorio?: number;
    idServicio?: number;
}
