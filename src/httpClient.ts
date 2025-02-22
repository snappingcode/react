type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  interceptors?: Array<(options: RequestInit) => void>;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private interceptors: Array<(options: RequestInit) => void>;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || "/api";
    this.headers = config.headers || {};
    this.interceptors = config.interceptors || [];
  }

  public async request(method: HttpMethod, url: string, data?: any) {
    const fullUrl = `${this.baseURL}${url}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.headers,
      },
      body:
        method !== "GET" && data
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined,
    };

    // Aplicar interceptores
    for (const interceptor of this.interceptors) {
      interceptor(options);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // If response has validation errors (e.g., Laravel)
      let concatenatedErrors = "";
      if (errorData?.errors) {
        concatenatedErrors = Object.values(errorData.errors).flat().join(" ");
      }

      const errorMessage =
        concatenatedErrors ||
        errorData?.message ||
        response.statusText ||
        "Unknown error occurred";

      throw new HttpError(response.status, errorMessage, errorData);
    }
    return response.json();
  }

  public get(url: string) {
    return this.request("GET", url);
  }

  public post(url: string, data?: any) {
    return this.request("POST", url, data);
  }

  public put(url: string, data: any) {
    return this.request("PUT", url, data);
  }

  public delete(url: string) {
    return this.request("DELETE", url);
  }

  public setBaseURL(url: string) {
    this.baseURL = url;
  }

  public setHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
  }

  public removeHeader(headerKey: string) {
    delete this.headers[headerKey];
  }

  public addInterceptor(interceptor: (options: RequestInit) => void) {
    this.interceptors.push(interceptor);
  }

  public clearInterceptors() {
    this.interceptors = [];
  }
}
// Crear un interceptor para añadir la hora del usuario
const userTimeInterceptor = (options: RequestInit) => {
  //const userTime = new Date().toLocaleString();
  const offset = new Date().getTimezoneOffset(); // En minutos
  const localTime = new Date(
    new Date().getTime() - offset * 60 * 1000
  ).toISOString();

  options.headers = {
    ...options.headers,
    "User-Time": localTime,
  };
};

// Crear instancias de HttpClient
export const httpClient = new HttpClient({
  interceptors: [userTimeInterceptor],
});

export const securedHttpClient = new HttpClient({
  interceptors: [
    userTimeInterceptor,
    (options: RequestInit) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    },
  ],
});
