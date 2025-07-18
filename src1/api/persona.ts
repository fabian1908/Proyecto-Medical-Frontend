import Api from "./api";
import {
    PersonaResponseDto,
    PersonaFilterDto,
    PersonaInsertDto,
    PersonaUpdateDto
} from "../interfaces/persona";
import axios from "axios";

/**
 * Obtiene todas las personas
 * @returns Promise<PersonaResponseDto[]> - Lista de personas
 */
export async function obtenerTodasLasPersonas(): Promise<PersonaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<PersonaResponseDto[]>({
        url: `/api/personas`,
    });
    return data;
}

/**
 * Obtiene personas filtradas
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<PersonaResponseDto[]> - Lista de personas filtradas
 */
export async function obtenerPersonasFiltradas(
    filter: PersonaFilterDto
): Promise<PersonaResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<PersonaFilterDto, PersonaResponseDto[]>(
        filter,
        { url: `/api/personas/filter` }
    );
    return data;
}

/**
 * Obtiene una persona por su ID
 * @param id - ID de la persona
 * @returns Promise<PersonaResponseDto | null> - Persona encontrada o null si no existe
 */
export async function obtenerPersonaPorId(id: number): Promise<PersonaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<PersonaResponseDto>({
            url: `/api/personas/${id}`,
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
 * Crea una nueva persona
 * @param newPersona - Datos de la nueva persona
 * @returns Promise<PersonaResponseDto> - Persona creada
 */
export async function crearPersona(
    newPersona: PersonaInsertDto
): Promise<PersonaResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<PersonaInsertDto, PersonaResponseDto>(
        newPersona,
        { url: `/api/personas` }
    );
    return data;
}

/**
 * Actualiza una persona existente
 * @param id - ID de la persona a actualizar
 * @param updatedPersona - Datos actualizados
 * @returns Promise<PersonaResponseDto | null> - Persona actualizada o null si no existe
 */
export async function actualizarPersona(
    id: number,
    updatedPersona: PersonaUpdateDto
): Promise<PersonaResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<PersonaUpdateDto, PersonaResponseDto>(
            updatedPersona,
            { url: `/api/personas/${id}` }
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
 * Elimina una persona
 * @param id - ID de la persona a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarPersona(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/personas/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}
