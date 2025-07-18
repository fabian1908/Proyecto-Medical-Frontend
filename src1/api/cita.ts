import Api from "./api";
import {
    CitaResponseDto,
    CitaFilterDto,
    CitaInsertDto,
    CitaUpdateDto
} from "../interfaces/cita";
import axios from "axios";

/**
 * Obtiene todas las citas
 * @returns Promise<CitaResponseDto[]> - Lista de citas
 */
export async function obtenerTodasLasCitas(): Promise<CitaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<CitaResponseDto[]>({
        url: `/api/citas`,
    });
    return data;
}

/**
 * Obtiene citas filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<CitaResponseDto[]> - Lista de citas filtradas
 */
export async function obtenerCitasFiltradas(
    filter: CitaFilterDto
): Promise<CitaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<CitaFilterDto, CitaResponseDto[]>(
        filter,
        { url: `/api/citas/filter` }
    );
    return data;
}

/**
 * Obtiene una cita por su ID
 * @param id - ID de la cita
 * @returns Promise<CitaResponseDto | null> - Cita encontrada o null si no existe
 */
export async function obtenerCitaPorId(id: number): Promise<CitaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<CitaResponseDto>({
            url: `/api/citas/${id}`,
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
 * Crea una nueva cita
 * @param newCita - Datos de la nueva cita
 * @returns Promise<CitaResponseDto> - Cita creada
 */
export async function crearCita(
    newCita: CitaInsertDto
): Promise<CitaResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<CitaInsertDto, CitaResponseDto>(
        newCita,
        { url: `/api/citas` }
    );
    return data;
}

/**
 * Actualiza una cita existente
 * @param id - ID de la cita a actualizar
 * @param updatedCita - Datos actualizados
 * @returns Promise<CitaResponseDto | null> - Cita actualizada o null si no existe
 */
export async function actualizarCita(
    id: number,
    updatedCita: CitaUpdateDto
): Promise<CitaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<CitaUpdateDto, CitaResponseDto>(
            updatedCita,
            { url: `/api/citas/${id}` }
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
 * Elimina una cita
 * @param id - ID de la cita a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarCita(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/citas/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

