export enum EstadoPagoEnum {
    PENDIENTE = "PENDIENTE",
    PAGADO = "PAGADO",
    RECHAZADO = "RECHAZADO",
    REEMBOLSADO = "REEMBOLSADO",
    CANCELADO = "CANCELADO"
}

export enum MetodoPagoEnum {
    EFECTIVO = "EFECTIVO",
    TRANSFERENCIA = "TRANSFERENCIA",
    YAPE = "YAPE",
    PLIN = "PLIN",
    TARJETA = "TARJETA"
}

export interface DetallePagoResponseDto {
    idDetallePago: number;
    idCita: number;
    monto: number;
    metodoPago: MetodoPagoEnum;
    estadoPago: EstadoPagoEnum;
}

export interface DetallePagoInsertDto {
    monto: number;
    metodoPago: MetodoPagoEnum;
    estadoPago?: EstadoPagoEnum;
    idCita: number;
}

export interface DetallePagoFilterDto {
    idDetallePago?: number;
    idCita?: number;
    monto?: number;
    metodoPago?: MetodoPagoEnum;
    estadoPago?: EstadoPagoEnum;
}

export interface DetallePagoUpdateDto {
    monto?: number;
    metodoPago?: MetodoPagoEnum;
    estadoPago?: EstadoPagoEnum;
}
