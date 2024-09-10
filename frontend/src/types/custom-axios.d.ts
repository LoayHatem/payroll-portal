/* eslint-disable */
import axios, { AxiosResponse } from "axios";

export interface IAxiosResponseWithError<T> extends AxiosResponse {
  data: { errorMessage?: string } & T;
}

declare module "axios" {
  export interface AxiosInstance {
    request<T = any, R = IAxiosResponseWithError<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    postForm<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    putForm<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patchForm<T = any, R = IAxiosResponseWithError<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}

export {};
