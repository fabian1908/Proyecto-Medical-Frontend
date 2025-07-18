export enum EstadoCitaEnum {
    SOLICITADA = "SOLICITADA",
    ACEPTADA = "ACEPTADA",
    PAGADA = "PAGADA",
    MODIFICADA = "MODIFICADA",
    REALIZADA = "REALIZADA",
    CANCELADA = "CANCELADA"
}

export interface CitaResponseDto {
    idCita: number;
    idPaciente: number;
    idConsultorioServicioU: number;
    motivo: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
    estado: EstadoCitaEnum;
    descripcion: string;
}

export interface CitaInsertDto {
    idPaciente: number;
    idConsultorioServicioU: number;
    motivo: string;
    fechaHoraInicio: string;
    fechaHoraFin: string;
    estado: EstadoCitaEnum;
    descripcion: string;
}

export interface CitaFilterDto {
    idCita?: number;
    idConsultorioServicioU?: number;
    idPersona?: number;
    fechaHoraInicio?: string;
    fechaHoraFin?: string;
    estado?: EstadoCitaEnum;
}

export interface CitaUpdateDto {
    motivo?: string;
    fechaHoraInicio?: string;
    fechaHoraFin?: string;
    estado?: EstadoCitaEnum;
    descripcion?: string;
}
