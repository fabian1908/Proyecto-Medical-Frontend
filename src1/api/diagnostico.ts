import Api from "./api";
import {
    DiagnosticoResponseDto,
    DiagnosticoFilterDto,
    DiagnosticoInsertDto,
    DiagnosticoUpdateDto
} from "../interfaces/diagnostico";
import axios from "axios";

/**
 * Obtiene todos los diagnósticos
 * @returns Promise<DiagnosticoResponseDto[]> - Lista de diagnósticos
 */
export async function obtenerTodosLosDiagnosticos(): Promise<DiagnosticoResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<DiagnosticoResponseDto[]>({
        url: `/api/diagnosticos`,
    });
    return data;
}

/**
 * Obtiene diagnósticos filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<DiagnosticoResponseDto[]> - Lista de diagnósticos filtrados
 */
export async function obtenerDiagnosticosFiltrados(
    filter: DiagnosticoFilterDto
): Promise<DiagnosticoResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<DiagnosticoFilterDto, DiagnosticoResponseDto[]>(
        filter,
        { url: `/api/diagnosticos/filter` }
    );
    return data;
}

/**
 * Obtiene un diagnóstico por su ID
 * @param id - ID del diagnóstico
 * @returns Promise<DiagnosticoResponseDto | null> - Diagnóstico encontrado o null si no existe
 */
export async function obtenerDiagnosticoPorId(id: number): Promise<DiagnosticoResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<DiagnosticoResponseDto>({
            url: `/api/diagnosticos/${id}`,
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
 * Crea un nuevo diagnóstico
 * @param newDiagnostico - Datos del nuevo diagnóstico
 * @returns Promise<DiagnosticoResponseDto> - Diagnóstico creado
 */
export async function crearDiagnostico(
    newDiagnostico: DiagnosticoInsertDto
): Promise<DiagnosticoResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<DiagnosticoInsertDto, DiagnosticoResponseDto>(
        newDiagnostico,
        { url: `/api/diagnosticos` }
    );
    return data;
}

/**
 * Actualiza un diagnóstico existente
 * @param id - ID del diagnóstico a actualizar
 * @param updatedDiagnostico - Datos actualizados
 * @returns Promise<DiagnosticoResponseDto | null> - Diagnóstico actualizado o null si no existe
 */
export async function actualizarDiagnostico(
    id: number,
    updatedDiagnostico: DiagnosticoUpdateDto
): Promise<DiagnosticoResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<DiagnosticoUpdateDto, DiagnosticoResponseDto>(
            updatedDiagnostico,
            { url: `/api/diagnosticos/${id}` }
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
 * Elimina un diagnóstico
 * @param id - ID del diagnóstico a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarDiagnostico(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/diagnosticos/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

