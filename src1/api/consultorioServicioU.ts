import Api from "./api";
import {
    ConsultorioServicioUResponseDto,
    ConsultorioServicioUInsertDto,
    FilterConsultorioServicioUDto
} from "../interfaces/consultorioServicioU";
import axios from "axios";

/**
 * Obtiene todos los consultorios-servicios-usuarios
 * @returns Promise<ConsultorioServicioUResponseDto[]> - Lista de consultorios-servicios-usuarios
 */
export async function obtenerTodosLosConsultorioServicioU(): Promise<ConsultorioServicioUResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<ConsultorioServicioUResponseDto[]>({
        url: `/api/conseruser`,
    });
    return data;
}

/**
 * Obtiene consultorios-servicios-usuarios filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<ConsultorioServicioUResponseDto[]> - Lista de consultorios-servicios-usuarios filtrados
 */
export async function obtenerConsultorioServicioUFiltrados(
    filter: FilterConsultorioServicioUDto
): Promise<ConsultorioServicioUResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<FilterConsultorioServicioUDto, ConsultorioServicioUResponseDto[]>(
        filter,
        { url: `/api/conseruser/filter` }
    );
    return data;
}

/**
 * Obtiene un consultorio-servicio-usuario por su ID
 * @param id - ID del consultorio-servicio-usuario
 * @returns Promise<ConsultorioServicioUResponseDto | null> - Consultorio-servicio-usuario encontrado o null si no existe
 */
export async function obtenerConsultorioServicioUPorId(id: number): Promise<ConsultorioServicioUResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<ConsultorioServicioUResponseDto>({
            url: `/api/conseruser/${id}`,
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
 * Crea un nuevo consultorio-servicio-usuario
 * @param newConsultorioServicioU - Datos del nuevo consultorio-servicio-usuario
 * @returns Promise<ConsultorioServicioUResponseDto> - Consultorio-servicio-usuario creado
 */
export async function crearConsultorioServicioU(
    newConsultorioServicioU: ConsultorioServicioUInsertDto
): Promise<ConsultorioServicioUResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ConsultorioServicioUInsertDto, ConsultorioServicioUResponseDto>(
        newConsultorioServicioU,
        { url: `/api/conseruser` }
    );
    return data;
}

/**
 * Elimina un consultorio-servicio-usuario
 * @param id - ID del consultorio-servicio-usuario a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarConsultorioServicioU(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/conseruser/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

