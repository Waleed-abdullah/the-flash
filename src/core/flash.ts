import type { FlashInstance } from '../types/flash';
import type {
    HttpError,
    HttpInterceptor,
    HttpRequestConfig,
    HttpResponse,
  } from '../types/http';

  
  export class Flash implements FlashInstance {
    private interceptors: HttpInterceptor[] = [];
    private defaultConfig: Partial<HttpRequestConfig> = {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      responseType: 'json',
    };
  
    constructor(config?: Partial<HttpRequestConfig>) {
      if (config) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
      }
    }
  
    public async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
      try {
        // Merge default config with request config
        const mergedConfig = { ...this.defaultConfig, ...config };
  
        // Apply request interceptors
        let finalConfig = mergedConfig;
        for (const interceptor of this.interceptors) {
          if (interceptor.request) {
            finalConfig = await interceptor.request(finalConfig);
          }
        }
  
        // Create URL with query parameters
        const url = this.buildUrl(finalConfig);
  
        // Create request
        const response = await fetch(url, {
          method: finalConfig.method,
          headers: finalConfig.headers,
          body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
          signal: finalConfig.signal,
        });
  
        // Handle response
        let data;
        switch (finalConfig.responseType) {
          case 'json':
            data = await response.json();
            break;
          case 'text':
            data = await response.text();
            break;
          case 'blob':
            data = await response.blob();
            break;
          case 'arrayBuffer':
            data = await response.arrayBuffer();
            break;
          case 'formData':
            data = await response.formData();
            break;
          default:
            data = await response.json();
        }
  
        const httpResponse: HttpResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: this.getHeadersFromResponse(response),
          config: finalConfig,
        };
  
        // Apply response interceptors
        let finalResponse = httpResponse;
        for (const interceptor of this.interceptors) {
          if (interceptor.response) {
            finalResponse = await interceptor.response(finalResponse);
          }
        }
  
        return finalResponse;
      } catch (error) {
        const httpError: HttpError = {
          name: 'HttpError',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          config: config,
          code: error instanceof Error ? error.name : undefined,
        };
  
        // Apply error interceptors
        let finalError = httpError;
        for (const interceptor of this.interceptors) {
          if (interceptor.error) {
            finalError = await interceptor.error(finalError);
          }
        }
  
        throw finalError;
      }
    }
  
    public use(interceptor: HttpInterceptor): void {
      this.interceptors.push(interceptor);
    }
  
    private buildUrl(config: HttpRequestConfig): string {
      const url = new URL(config.url);
      
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
  
      return url.toString();
    }
  
    private getHeadersFromResponse(response: Response): Record<string, string> {
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      return headers;
    }


    public async get<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
      return this.request<T>({
        ...config,
        url,
        method: 'GET',
      });
    }
  
    public async post<T = unknown>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
      return this.request<T>({
        ...config,
        url,
        method: 'POST',
        data,
      });
    }
  
    public async put<T = unknown>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
      return this.request<T>({
        ...config,
        url,
        method: 'PUT',
        data,
      });
    }
  
    public async delete<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
      return this.request<T>({
        ...config,
        url,
        method: 'DELETE',
      });
    }
  
    public async patch<T = unknown>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
      return this.request<T>({
        ...config,
        url,
        method: 'PATCH',
        data,
      });
    }
  } 