import Api from "./api";
import {
    DetallePagoResponseDto,
    DetallePagoFilterDto,
    DetallePagoInsertDto,
    DetallePagoUpdateDto
} from "../interfaces/detallePago";
import axios from "axios";

/**
 * Obtiene todos los detalles de pago
 * @returns Promise<DetallePagoResponseDto[]> - Lista de detalles de pago
 */
export async function obtenerTodosLosDetallesPago(): Promise<DetallePagoResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<DetallePagoResponseDto[]>({
        url: `/api/detalles-pago`,
    });
    return data;
}

/**
 * Obtiene detalles de pago filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<DetallePagoResponseDto[]> - Lista de detalles de pago filtrados
 */
export async function obtenerDetallesPagoFiltrados(
    filter: DetallePagoFilterDto
): Promise<DetallePagoResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<DetallePagoFilterDto, DetallePagoResponseDto[]>(
        filter,
        { url: `/api/detalles-pago/filter` }
    );
    return data;
}

/**
 * Obtiene un detalle de pago por su ID
 * @param id - ID del detalle de pago
 * @returns Promise<DetallePagoResponseDto | null> - Detalle de pago encontrado o null si no existe
 */
export async function obtenerDetallePagoPorId(id: number): Promise<DetallePagoResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<DetallePagoResponseDto>({
            url: `/api/detalles-pago/${id}`,
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

/**
 * Crea un nuevo detalle de pago
 * @param newDetallePago - Datos del nuevo detalle de pago
 * @returns Promise<DetallePagoResponseDto> - Detalle de pago creado
 */
export async function crearDetallePago(
    newDetallePago: DetallePagoInsertDto
): Promise<DetallePagoResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<DetallePagoInsertDto, DetallePagoResponseDto>(
        newDetallePago,
        { url: `/api/detalles-pago` }
    );
    return data;
}

/**
 * Actualiza un detalle de pago existente
 * @param id - ID del detalle de pago a actualizar
 * @param updatedDetallePago - Datos actualizados
 * @returns Promise<DetallePagoResponseDto | null> - Detalle de pago actualizado o null si no existe
 */
export async function actualizarDetallePago(
    id: number,
    updatedDetallePago: DetallePagoUpdateDto
): Promise<DetallePagoResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<DetallePagoUpdateDto, DetallePagoResponseDto>(
            updatedDetallePago,
            { url: `/api/detalles-pago/${id}` }
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

/**
 * Elimina un detalle de pago
 * @param id - ID del detalle de pago a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarDetallePago(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/detalles-pago/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

