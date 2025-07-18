import Api from "./api";
import {
    ConsultorioResponseDto,
    ConsultorioFilterDto,
    ConsultorioInsertDto,
    ConsultorioUpdateDto
} from "../interfaces/consultorio";
import axios from "axios";

/**
 * Obtiene todos los consultorios
 * @returns Promise<ConsultorioResponseDto[]> - Lista de consultorios
 */
export async function obtenerTodosLosConsultorios(): Promise<ConsultorioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<ConsultorioResponseDto[]>({
        url: `/api/consultorios`,
    });
    return data;
}

/**
 * Obtiene consultorios filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<ConsultorioResponseDto[]> - Lista de consultorios filtrados
 */
export async function obtenerConsultoriosFiltrados(
    filter: ConsultorioFilterDto
): Promise<ConsultorioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ConsultorioFilterDto, ConsultorioResponseDto[]>(
        filter,
        { url: `/api/consultorios/filter` }
    );
    return data;
}

/**
 * Obtiene un consultorio por su ID
 * @param id - ID del consultorio
 * @returns Promise<ConsultorioResponseDto | null> - Consultorio encontrado o null si no existe
 */
export async function obtenerConsultorioPorId(id: number): Promise<ConsultorioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<ConsultorioResponseDto>({
            url: `/api/consultorios/${id}`,
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
 * Crea un nuevo consultorio
 * @param newConsultorio - Datos del nuevo consultorio
 * @returns Promise<ConsultorioResponseDto> - Consultorio creado
 */
export async function crearConsultorio(
    newConsultorio: ConsultorioInsertDto
): Promise<ConsultorioResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<ConsultorioInsertDto, ConsultorioResponseDto>(
        newConsultorio,
        { url: `/api/consultorios` }
    );
    return data;
}

/**
 * Actualiza un consultorio existente
 * @param id - ID del consultorio a actualizar
 * @param updatedConsultorio - Datos actualizados
 * @returns Promise<ConsultorioResponseDto | null> - Consultorio actualizado o null si no existe
 */
export async function actualizarConsultorio(
    id: number,
    updatedConsultorio: ConsultorioUpdateDto
): Promise<ConsultorioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<ConsultorioUpdateDto, ConsultorioResponseDto>(
            updatedConsultorio,
            { url: `/api/consultorios/${id}` }
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
 * Elimina un consultorio
 * @param id - ID del consultorio a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarConsultorio(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/consultorios/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

