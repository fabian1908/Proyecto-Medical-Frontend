import Api from "./api";
import {
    ServicioResponseDto,
    ServicioFilterDto,
    ServicioInsertDto,
    ServicioUpdateDto
} from "../interfaces/servicio";
import axios from "axios";

/**
 * Obtiene todos los servicios
 * @returns Promise<ServicioResponseDto[]> - Lista de servicios
 */
export async function obtenerTodosLosServicios(): Promise<ServicioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<ServicioResponseDto[]>({
        url: `/api/servicios`,
    });
    return data;
}

/**
 * Obtiene servicios filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<ServicioResponseDto[]> - Lista de servicios filtrados
 */
export async function obtenerServiciosFiltrados(
    filter: ServicioFilterDto
): Promise<ServicioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ServicioFilterDto, ServicioResponseDto[]>(
        filter,
        { url: `/api/servicios/filter` }
    );
    return data;
}

/**
 * Obtiene un servicio por su ID
 * @param id - ID del servicio
 * @returns Promise<ServicioResponseDto | null> - Servicio encontrado o null si no existe
 */
export async function obtenerServicioPorId(id: number): Promise<ServicioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<ServicioResponseDto>({
            url: `/api/servicios/${id}`,
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
 * Crea un nuevo servicio
 * @param newServicio - Datos del nuevo servicio
 * @returns Promise<ServicioResponseDto> - Servicio creado
 */
export async function crearServicio(
    newServicio: ServicioInsertDto
): Promise<ServicioResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ServicioInsertDto, ServicioResponseDto>(
        newServicio,
        { url: `/api/servicios` }
    );
    return data;
}

/**
 * Actualiza un servicio existente
 * @param id - ID del servicio a actualizar
 * @param updatedServicio - Datos actualizados
 * @returns Promise<ServicioResponseDto | null> - Servicio actualizado o null si no existe
 */
export async function actualizarServicio(
    id: number,
    updatedServicio: ServicioUpdateDto
): Promise<ServicioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<ServicioUpdateDto, ServicioResponseDto>(
            updatedServicio,
            { url: `/api/servicios/${id}` }
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
 * Elimina un servicio
 * @param id - ID del servicio a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarServicio(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/servicios/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

