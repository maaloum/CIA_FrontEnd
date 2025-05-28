import { ApiResponse } from "../types/api";

const API_BASE_URL = "https://cia-backend-shfd.onrender.com/api/v1";

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const error = isJson
        ? await response
            .json()
            .catch(() => ({ message: "Unknown error occurred" }))
        : { message: (await response.text()) || "Unknown error occurred" };
      throw new Error(error.message || "An error occurred");
    }

    // Handle empty responses
    if (response.status === 204 || !isJson) {
      return {
        data: {} as T,
        status: response.status,
        message: "Success",
      };
    }

    try {
      const data = await response.json();
      return {
        data,
        status: response.status,
        message: "Success",
      };
    } catch {
      throw new Error(" Failed to parse response");
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    token?: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    token?: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService(API_BASE_URL);
