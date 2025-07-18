import Api from "./api";
import {
    RecetaResponseDto,
    RecetaFilterDto,
    RecetaInsertDto,
    RecetaUpdateDto
} from "../interfaces/receta";
import axios from "axios";

/**
 * Obtiene todas las recetas
 * @returns Promise<RecetaResponseDto[]> - Lista de recetas
 */
export async function obtenerTodasLasRecetas(): Promise<RecetaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<RecetaResponseDto[]>({
        url: `/api/recetas`,
    });
    return data;
}

/**
 * Obtiene recetas filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<RecetaResponseDto[]> - Lista de recetas filtradas
 */
export async function obtenerRecetasFiltradas(
    filter: RecetaFilterDto
): Promise<RecetaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<RecetaFilterDto, RecetaResponseDto[]>(
        filter,
        { url: `/api/recetas/filter` }
    );
    return data;
}

/**
 * Obtiene una receta por su ID
 * @param id - ID de la receta
 * @returns Promise<RecetaResponseDto | null> - Receta encontrada o null si no existe
 */
export async function obtenerRecetaPorId(id: number): Promise<RecetaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<RecetaResponseDto>({
            url: `/api/recetas/${id}`,
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
 * Crea una nueva receta
 * @param newReceta - Datos de la nueva receta
 * @returns Promise<RecetaResponseDto> - Receta creada
 */
export async function crearReceta(
    newReceta: RecetaInsertDto
): Promise<RecetaResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<RecetaInsertDto, RecetaResponseDto>(
        newReceta,
        { url: `/api/recetas` }
    );
    return data;
}

/**
 * Actualiza una receta existente
 * @param id - ID de la receta a actualizar
 * @param updatedReceta - Datos actualizados
 * @returns Promise<RecetaResponseDto | null> - Receta actualizada o null si no existe
 */
export async function actualizarReceta(
    id: number,
    updatedReceta: RecetaUpdateDto
): Promise<RecetaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<RecetaUpdateDto, RecetaResponseDto>(
            updatedReceta,
            { url: `/api/recetas/${id}` }
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
 * Elimina una receta
 * @param id - ID de la receta a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarReceta(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/recetas/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

