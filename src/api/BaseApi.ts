import { AxiosInstance, AxiosRequestConfig } from "axios";

export abstract class BaseApi {
  protected axiosInstance: AxiosInstance;
  protected module: string;

  constructor(axiosInstance: AxiosInstance, module: string, token: string) {
    this.axiosInstance = axiosInstance;
    this.module = module;

    // Set default Authorization header
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  protected async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.get(
      `${this.module}${url}`,
      config
    );
    return response.data;
  }

  protected async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post(
      `${this.module}${url}`,
      data,
      config
    );
    return response.data;
  }

  protected async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put(
      `${this.module}${url}`,
      data,
      config
    );
    return response.data;
  }

  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch(
      `${this.module}${url}`,
      data,
      config
    );
    return response.data;
  }

  protected async delete(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    const response = await this.axiosInstance.delete(
      `${this.module}${url}`,
      config
    );
    return response.data;
  }
}
