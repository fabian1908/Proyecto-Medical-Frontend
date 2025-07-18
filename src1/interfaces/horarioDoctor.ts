export interface HorarioDoctorResponseDto {
    idHorarioDoctor: number;
    idDoctor: number;
    nombreDoctor: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
}

export interface HorarioDoctorInsertDto {
    idDoctor: number;
    diaSemana?: string;
    horaInicio: string;
    horaFin: string;
}

export interface HorarioDoctorFilterDto {
    idhorariodoctor?: number;
    iddoctor?: number;
    diaSemana?: string;
    horaInicio?: string;
    horaFin?: string;
}

export interface HorarioDoctorUpdateDto {
    diaSemana?: string;
    horaInicio: string;
    horaFin: string;
}
