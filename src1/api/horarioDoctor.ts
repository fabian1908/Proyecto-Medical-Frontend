import Api from "./api";
import {
    HorarioDoctorResponseDto,
    HorarioDoctorFilterDto,
    HorarioDoctorInsertDto,
    HorarioDoctorUpdateDto
} from "../interfaces/horarioDoctor";
import axios from "axios";

/**
 * Obtiene todos los horarios de doctores
 * @returns Promise<HorarioDoctorResponseDto[]> - Lista de horarios de doctores
 */
export async function obtenerTodosLosHorariosDoctores(): Promise<HorarioDoctorResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<HorarioDoctorResponseDto[]>({
        url: `/api/horarios-doctores`,
    });
    return data;
}

/**
 * Obtiene horarios de doctores filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<HorarioDoctorResponseDto[]> - Lista de horarios de doctores filtrados
 */
export async function obtenerHorariosDoctoresFiltrados(
    filter: HorarioDoctorFilterDto
): Promise<HorarioDoctorResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<HorarioDoctorFilterDto, HorarioDoctorResponseDto[]>(
        filter,
        { url: `/api/horarios-doctores/filter` }
    );
    return data;
}

/**
 * Obtiene un horario de doctor por su ID
 * @param id - ID del horario de doctor
 * @returns Promise<HorarioDoctorResponseDto | null> - Horario de doctor encontrado o null si no existe
 */
export async function obtenerHorarioDoctorPorId(id: number): Promise<HorarioDoctorResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<HorarioDoctorResponseDto>({
            url: `/api/horarios-doctores/${id}`,
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
 * Crea un nuevo horario de doctor
 * @param newHorarioDoctor - Datos del nuevo horario de doctor
 * @returns Promise<HorarioDoctorResponseDto> - Horario de doctor creado
 */
export async function crearHorarioDoctor(
    newHorarioDoctor: HorarioDoctorInsertDto
): Promise<HorarioDoctorResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<HorarioDoctorInsertDto, HorarioDoctorResponseDto>(
        newHorarioDoctor,
        { url: `/api/horarios-doctores` }
    );
    return data;
}

/**
 * Actualiza un horario de doctor existente
 * @param id - ID del horario de doctor a actualizar
 * @param updatedHorarioDoctor - Datos actualizados
 * @returns Promise<HorarioDoctorResponseDto | null> - Horario de doctor actualizado o null si no existe
 */
export async function actualizarHorarioDoctor(
    id: number,
    updatedHorarioDoctor: HorarioDoctorUpdateDto
): Promise<HorarioDoctorResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<HorarioDoctorUpdateDto, HorarioDoctorResponseDto>(
            updatedHorarioDoctor,
            { url: `/api/horarios-doctores/${id}` }
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
 * Elimina un horario de doctor
 * @param id - ID del horario de doctor a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarHorarioDoctor(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/horarios-doctores/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

