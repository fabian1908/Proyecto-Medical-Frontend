import Api from "./api";
import {LoginRequest} from "../interfaces/auth.ts";
import { UsuarioResponseDto} from "../interfaces";


/**
 * Verifica si el usuario tiene una cuenta
 * @param credenciales - Credenciales del usuario
 * @returns Promise<UsuarioResponseDto> - Info del usuario
 */
export async function loginUser(
    credenciales: LoginRequest
): Promise<UsuarioResponseDto> {
    const Apis = await Api.getInstance();
    const { data } = await Apis.post<LoginRequest, UsuarioResponseDto>(
        credenciales,
        { url: `/api/auth/login` }
    );
    return data;
}

/**
 * Verifica si el token actual es válido
 * @returns Promise<UsuarioResponseDto> - Info del usuario si el token es válido
 */
export async function verifyToken(): Promise<UsuarioResponseDto | null> {
    try {
        const Apis = await Api.getInstance();
        const { data } = await Apis.get<UsuarioResponseDto>(
            { url: `/api/auth/verify` }
        );
        return data;
    } catch (error) {
        console.error('Error verificando token:', error);
        return null;
    }
}

/**
 * Cierra la sesión del usuario
 * @returns Promise<void>
 */
export async function logoutUser(): Promise<void> {
    try {
        const Apis = await Api.getInstance();
        await Apis.post<void, void>(
            {},
            { url: `/api/auth/logout` }
        );
    } catch (error) {
        console.error('Error durante logout:', error);
        // No lanzar error, el logout local debería continuar
    }
}