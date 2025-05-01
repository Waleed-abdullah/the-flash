import type { ResponsePromise } from "./response";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface HttpHeaders {
  [key: string]: string;
}

export interface HttpRequestConfig {
  url: string;
  method: HttpMethod;
  headers?: HttpHeaders;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
  responseType?: keyof ResponsePromise;
  withCredentials?: boolean;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
  signal?: AbortSignal;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
  config: HttpRequestConfig;
}

export interface HttpError extends Error {
  config: HttpRequestConfig;
  response?: HttpResponse;
  code?: string;
}

export type HttpInterceptor = {
  request?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
  response?: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
  error?: (error: HttpError) => HttpError | Promise<HttpError>;
}; 