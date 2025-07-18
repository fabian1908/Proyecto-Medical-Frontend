import Api from "./api";
import {
    PermisoHistorialResponseDto,
    PermisoHistorialFilterDto,
    PermisoHistorialInsertDto,
    PermisoHistorialUpdateDto
} from "../interfaces/permisoHistorial";
import axios from "axios";

/**
 * Obtiene todos los permisos de historial
 * @returns Promise<PermisoHistorialResponseDto[]> - Lista de permisos de historial
 */
export async function obtenerTodosLosPermisosHistorial(): Promise<PermisoHistorialResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<PermisoHistorialResponseDto[]>({
        url: `/api/permisos-historial`,
    });
    return data;
}

/**
 * Obtiene permisos de historial filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<PermisoHistorialResponseDto[]> - Lista de permisos de historial filtrados
 */
export async function obtenerPermisosHistorialFiltrados(
    filter: PermisoHistorialFilterDto
): Promise<PermisoHistorialResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<PermisoHistorialFilterDto, PermisoHistorialResponseDto[]>(
        filter,
        { url: `/api/permisos-historial/filter` }
    );
    return data;
}

/**
 * Obtiene un permiso de historial por su ID
 * @param id - ID del permiso de historial
 * @returns Promise<PermisoHistorialResponseDto | null> - Permiso de historial encontrado o null si no existe
 */
export async function obtenerPermisoHistorialPorId(id: number): Promise<PermisoHistorialResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<PermisoHistorialResponseDto>({
            url: `/api/permisos-historial/${id}`,
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
 * Crea un nuevo permiso de historial
 * @param newPermisoHistorial - Datos del nuevo permiso de historial
 * @returns Promise<PermisoHistorialResponseDto> - Permiso de historial creado
 */
export async function crearPermisoHistorial(
    newPermisoHistorial: PermisoHistorialInsertDto
): Promise<PermisoHistorialResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<PermisoHistorialInsertDto, PermisoHistorialResponseDto>(
        newPermisoHistorial,
        { url: `/api/permisos-historial` }
    );
    return data;
}

/**
 * Actualiza un permiso de historial existente
 * @param id - ID del permiso de historial a actualizar
 * @param updatedPermisoHistorial - Datos actualizados
 * @returns Promise<PermisoHistorialResponseDto | null> - Permiso de historial actualizado o null si no existe
 */
export async function actualizarPermisoHistorial(
    id: number,
    updatedPermisoHistorial: PermisoHistorialUpdateDto
): Promise<PermisoHistorialResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<PermisoHistorialUpdateDto, PermisoHistorialResponseDto>(
            updatedPermisoHistorial,
            { url: `/api/permisos-historial/${id}` }
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
 * Elimina un permiso de historial
 * @param id - ID del permiso de historial a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarPermisoHistorial(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/permisos-historial/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

