import { HttpConfig, httpFactory } from "./http";
import ApiErrorInterceptor from "./interceptors/api-error.interceptor";

const Http = httpFactory(HttpConfig);

// Add authorization
// Http.interceptors.request.use(AuthInterceptorFactory((requestConfig: AxiosRequestConfig) => !!AuthHandler.auth));

// Add API error detection
Http.interceptors.response.use((res: any) => res, ApiErrorInterceptor);

export { Http };
