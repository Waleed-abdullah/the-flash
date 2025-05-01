export type ResponsePromise<T = unknown> = {
    blob: () => Promise<Blob>;
    json: <R = T>() => Promise<R>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    formData: () => Promise<FormData>;    
} 

