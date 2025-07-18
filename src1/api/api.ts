import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ApiRequestConfig {
    url: string;
    headers?: Record<string, string>;
}

interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

class Api {
    private static instance: Api | null = null;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para requests
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Aquí puedes agregar tokens de autenticación si es necesario
                // const token = localStorage.getItem('token');
                // if (token) {
                //     config.headers.Authorization = `Bearer ${token}`;
                // }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para responses
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Manejo global de errores
                if (error.response?.status === 401) {
                    // Token expirado o no autorizado
                    // localStorage.removeItem('token');
                    // window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public static async getInstance(): Promise<Api> {
        if (!Api.instance) {
            Api.instance = new Api();
        }
        return Api.instance;
    }

    public async get<TResponse>(config: ApiRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.axiosInstance.get(config.url, {
            headers: config.headers,
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async post<TRequest, TResponse>(
        data: TRequest,
        config: ApiRequestConfig
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.axiosInstance.post(config.url, data, {
            headers: config.headers,
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async patch<TRequest, TResponse>(
        data: TRequest,
        config: ApiRequestConfig
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.axiosInstance.patch(config.url, data, {
            headers: config.headers,
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async put<TRequest, TResponse>(
        data: TRequest,
        config: ApiRequestConfig
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.axiosInstance.put(config.url, data, {
            headers: config.headers,
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async delete<TResponse = void>(config: ApiRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.axiosInstance.delete(config.url, {
            headers: config.headers,
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }
}

export default Api;
