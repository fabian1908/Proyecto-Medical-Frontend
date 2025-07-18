export enum EstadoPermisosEnum {
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO"
}

export interface PermisoHistorialResponseDto {
    idPermisoHistorial: number;
    idDoctor: number;
    idPaciente: number;
    fechaOtorgaPermiso: string;
    fechaDeniegaPermiso: string;
    estado: EstadoPermisosEnum;
}

export interface PermisoHistorialInsertDto {
    idDoctor: number;
    idPaciente: number;
    fechaDeniegaPermiso: string;
    estado?: boolean;
}

export interface PermisoHistorialFilterDto {
    idpermisohistorial?: number;
    iddoctor?: number;
    idpaciente?: number;
    fechaotorgapermiso?: string;
    fechadeniegapermiso?: string;
    estado?: boolean;
}

export interface PermisoHistorialUpdateDto {
    idDoctor?: number;
    idPaciente?: number;
    fechaDeniegaPermiso?: string;
    estado?: EstadoPermisosEnum;
}
