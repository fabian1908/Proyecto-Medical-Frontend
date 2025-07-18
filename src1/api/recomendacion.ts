import Api from "./api";
import {
    RecomendacionResponseDto,
    RecomendacionFilterDto,
    RecomendacionInsertDto,
    RecomendacionUpdateDto
} from "../interfaces/recomendacion";
import axios from "axios";

/**
 * Obtiene todas las recomendaciones
 * @returns Promise<RecomendacionResponseDto[]> - Lista de recomendaciones
 */
export async function obtenerTodasLasRecomendaciones(): Promise<RecomendacionResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<RecomendacionResponseDto[]>({
        url: `/api/recomendaciones`,
    });
    return data;
}

/**
 * Obtiene recomendaciones filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<RecomendacionResponseDto[]> - Lista de recomendaciones filtradas
 */
export async function obtenerRecomendacionesFiltradas(
    filter: RecomendacionFilterDto
): Promise<RecomendacionResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<RecomendacionFilterDto, RecomendacionResponseDto[]>(
        filter,
        { url: `/api/recomendaciones/filter` }
    );
    return data;
}

/**
 * Obtiene una recomendación por su ID
 * @param id - ID de la recomendación
 * @returns Promise<RecomendacionResponseDto | null> - Recomendación encontrada o null si no existe
 */
export async function obtenerRecomendacionPorId(id: number): Promise<RecomendacionResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<RecomendacionResponseDto>({
            url: `/api/recomendaciones/${id}`,
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
 * Crea una nueva recomendación
 * @param newRecomendacion - Datos de la nueva recomendación
 * @returns Promise<RecomendacionResponseDto> - Recomendación creada
 */
export async function crearRecomendacion(
    newRecomendacion: RecomendacionInsertDto
): Promise<RecomendacionResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<RecomendacionInsertDto, RecomendacionResponseDto>(
        newRecomendacion,
        { url: `/api/recomendaciones` }
    );
    return data;
}

/**
 * Actualiza una recomendación existente
 * @param id - ID de la recomendación a actualizar
 * @param updatedRecomendacion - Datos actualizados
 * @returns Promise<RecomendacionResponseDto | null> - Recomendación actualizada o null si no existe
 */
export async function actualizarRecomendacion(
    id: number,
    updatedRecomendacion: RecomendacionUpdateDto
): Promise<RecomendacionResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<RecomendacionUpdateDto, RecomendacionResponseDto>(
            updatedRecomendacion,
            { url: `/api/recomendaciones/${id}` }
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
 * Elimina una recomendación
 * @param id - ID de la recomendación a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarRecomendacion(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/recomendaciones/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

