export enum TipoUsuarioEnum {
    PACIENTE = "PACIENTE",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
    COORDINADOR = "COORDINADOR"
}

export interface UsuarioResponseDto {
    idUsuario: number;
    idPersona: number;
    tipoUsuario: TipoUsuarioEnum;
    correo: string;
    estado: boolean;
    codigoCMP: string;
    token?: string; // Token JWT opcional para autenticación
}

export interface UsuarioInsertDto {
    idPersona: number;
    correo: string;
    tipoUsuario: TipoUsuarioEnum;
    contrasenia: string;
    estado?: boolean;
    codigoCMP?: string;
}

export interface UsuarioFilterDto {
    dniPersona?: number;
    tipoUsuarioId?: number;
    usuario?: string;
    contrasenia?: string;
    estado?: boolean;
}

export interface UsuarioUpdateDto {
    codigoCMP?: string;
    contrasenia?: string;
    estado?: boolean;
}
