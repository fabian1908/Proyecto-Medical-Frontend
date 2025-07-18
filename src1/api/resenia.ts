import Api from "./api";
import {
    ReseniaResponseDto,
    ReseniaFilterDto,
    ReseniaInsertDto,
    ReseniaUpdateDto
} from "../interfaces/resenia";
import axios from "axios";

/**
 * Obtiene todas las reseñas
 * @returns Promise<ReseniaResponseDto[]> - Lista de reseñas
 */
export async function obtenerTodasLasResenias(): Promise<ReseniaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<ReseniaResponseDto[]>({
        url: `/api/resenias`,
    });
    return data;
}

/**
 * Obtiene reseñas filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<ReseniaResponseDto[]> - Lista de reseñas filtradas
 */
export async function obtenerReseniasFiltradas(
    filter: ReseniaFilterDto
): Promise<ReseniaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ReseniaFilterDto, ReseniaResponseDto[]>(
        filter,
        { url: `/api/resenias/filter` }
    );
    return data;
}

/**
 * Obtiene una reseña por su ID
 * @param id - ID de la reseña
 * @returns Promise<ReseniaResponseDto | null> - Reseña encontrada o null si no existe
 */
export async function obtenerReseniaPorId(id: number): Promise<ReseniaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<ReseniaResponseDto>({
            url: `/api/resenias/${id}`,
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
 * Crea una nueva reseña
 * @param newResenia - Datos de la nueva reseña
 * @returns Promise<ReseniaResponseDto> - Reseña creada
 */
export async function crearResenia(
    newResenia: ReseniaInsertDto
): Promise<ReseniaResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ReseniaInsertDto, ReseniaResponseDto>(
        newResenia,
        { url: `/api/resenias` }
    );
    return data;
}

/**
 * Actualiza una reseña existente
 * @param id - ID de la reseña a actualizar
 * @param updatedResenia - Datos actualizados
 * @returns Promise<ReseniaResponseDto | null> - Reseña actualizada o null si no existe
 */
export async function actualizarResenia(
    id: number,
    updatedResenia: ReseniaUpdateDto
): Promise<ReseniaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<ReseniaUpdateDto, ReseniaResponseDto>(
            updatedResenia,
            { url: `/api/resenias/${id}` }
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
 * Elimina una reseña
 * @param id - ID de la reseña a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarResenia(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/resenias/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

