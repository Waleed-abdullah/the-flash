import type { HttpRequestConfig, HttpResponse } from "./http";

export type FlashInstance = {
    get: <T>(url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    post: <T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    put: <T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    delete: <T>(url: string, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
    patch: <T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>) => Promise<HttpResponse<T>>;
}