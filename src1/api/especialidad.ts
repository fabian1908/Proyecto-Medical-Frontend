import Api from "./api";
import {
    EspecialidadResponseDto,
    EspecialidadFilterDto,
    EspecialidadInsertDto,
    EspecialidadUpdateDto
} from "../interfaces/especialidad";
import axios from "axios";

/**
 * Obtiene todas las especialidades
 * @returns Promise<EspecialidadResponseDto[]> - Lista de especialidades
 */
export async function obtenerTodasLasEspecialidades(): Promise<EspecialidadResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<EspecialidadResponseDto[]>({
        url: `/api/especialidades`,
    });
    return data;
}

/**
 * Obtiene especialidades filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<EspecialidadResponseDto[]> - Lista de especialidades filtradas
 */
export async function obtenerEspecialidadesFiltradas(
    filter: EspecialidadFilterDto
): Promise<EspecialidadResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<EspecialidadFilterDto, EspecialidadResponseDto[]>(
        filter,
        { url: `/api/especialidades/filter` }
    );
    return data;
}

/**
 * Obtiene una especialidad por su ID
 * @param id - ID de la especialidad
 * @returns Promise<EspecialidadResponseDto | null> - Especialidad encontrada o null si no existe
 */
export async function obtenerEspecialidadPorId(id: number): Promise<EspecialidadResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<EspecialidadResponseDto>({
            url: `/api/especialidades/${id}`,
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
 * Crea una nueva especialidad
 * @param newEspecialidad - Datos de la nueva especialidad
 * @returns Promise<EspecialidadResponseDto> - Especialidad creada
 */
export async function crearEspecialidad(
    newEspecialidad: EspecialidadInsertDto
): Promise<EspecialidadResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<EspecialidadInsertDto, EspecialidadResponseDto>(
        newEspecialidad,
        { url: `/api/especialidades` }
    );
    return data;
}

/**
 * Actualiza una especialidad existente
 * @param id - ID de la especialidad a actualizar
 * @param updatedEspecialidad - Datos actualizados
 * @returns Promise<EspecialidadResponseDto | null> - Especialidad actualizada o null si no existe
 */
export async function actualizarEspecialidad(
    id: number,
    updatedEspecialidad: EspecialidadUpdateDto
): Promise<EspecialidadResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<EspecialidadUpdateDto, EspecialidadResponseDto>(
            updatedEspecialidad,
            { url: `/api/especialidades/${id}` }
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
 * Elimina una especialidad
 * @param id - ID de la especialidad a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarEspecialidad(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/especialidades/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

