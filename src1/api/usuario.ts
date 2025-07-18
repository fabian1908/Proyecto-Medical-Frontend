import Api from "./api";
import {
    UsuarioResponseDto,
    UsuarioFilterDto,
    UsuarioInsertDto,
    UsuarioUpdateDto
} from "../interfaces/usuario";
import axios from "axios";
import apiClient from "./axiosConfig";

/**
 * Autentica un usuario (Login)
 * @param usuario - Nombre de usuario o correo
 * @param contrasenia - Contraseña del usuario
 * @returns Promise<UsuarioResponseDto[]> - Lista de usuarios que coinciden (normalmente 1 o vacío)
 */
export async function autenticarUsuario(
    usuario: string,
    contrasenia: string
): Promise<UsuarioResponseDto[]> {
    const response = await apiClient.post('/api/usuarios/filter', {
        usuario: usuario,
        contrasenia: contrasenia,
    });
    return response.data;
}

/**
 * Autentica un usuario usando la API class (alternativa)
 * @param usuario - Nombre de usuario o correo
 * @param contrasenia - Contraseña del usuario
 * @returns Promise<UsuarioResponseDto[]> - Lista de usuarios que coinciden
 */
export async function autenticarUsuarioConApi(
    usuario: string,
    contrasenia: string
): Promise<UsuarioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<{usuario: string, contrasenia: string}, UsuarioResponseDto[]>(
        { usuario, contrasenia },
        { url: `/api/usuarios/filter` }
    );
    return data;
}

/**
 * Obtiene todos los usuarios
 * @returns Promise<UsuarioResponseDto[]> - Lista de usuarios
 */
export async function obtenerTodosLosUsuarios(): Promise<UsuarioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.get<UsuarioResponseDto[]>({
        url: `/api/usuarios`,
    });
    return data;
}

/**
 * Obtiene usuarios filtrados
 * @param filter - Objeto con los criterios de filtrado
 * @returns Promise<UsuarioResponseDto[]> - Lista de usuarios filtrados
 */
export async function obtenerUsuariosFiltrados(
    filter: UsuarioFilterDto
): Promise<UsuarioResponseDto[]> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<UsuarioFilterDto, UsuarioResponseDto[]>(
        filter,
        { url: `/api/usuarios/filter` }
    );
    return data;
}

/**
 * Obtiene un usuario por su ID
 * @param id - ID del usuario
 * @returns Promise<UsuarioResponseDto | null> - Usuario encontrado o null si no existe
 */
export async function obtenerUsuarioPorId(id: number): Promise<UsuarioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<UsuarioResponseDto>({
            url: `/api/usuarios/${id}`,
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
 * Crea un nuevo usuario
 * @param newUsuario - Datos del nuevo usuario
 * @returns Promise<UsuarioResponseDto> - Usuario creado
 */
export async function crearUsuario(
    newUsuario: UsuarioInsertDto
): Promise<UsuarioResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<UsuarioInsertDto, UsuarioResponseDto>(
        newUsuario,
        { url: `/api/usuarios` }
    );
    return data;
}

/**
 * Actualiza un usuario existente
 * @param id - ID del usuario a actualizar
 * @param updatedUsuario - Datos actualizados
 * @returns Promise<UsuarioResponseDto | null> - Usuario actualizado o null si no existe
 */
export async function actualizarUsuario(
    id: number,
    updatedUsuario: UsuarioUpdateDto
): Promise<UsuarioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.patch<UsuarioUpdateDto, UsuarioResponseDto>(
            updatedUsuario,
            { url: `/api/usuarios/${id}` }
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
 * Elimina un usuario
 * @param id - ID del usuario a eliminar
 * @returns Promise<boolean> - True si se eliminó correctamente, false si no se encontró
 */
export async function eliminarUsuario(id: number): Promise<boolean> {
    try {
        const Apis = await Api.getInstance();
        await Apis.delete({
            url: `/api/usuarios/${id}`,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}
