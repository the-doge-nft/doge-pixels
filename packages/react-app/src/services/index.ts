import { HttpConfig, httpFactory } from "./http";
import ApiErrorInterceptor from "./interceptors/api-error.interceptor";
import AuthInterceptorFactory from "./interceptors/auth.interceptor";
import AuthHandler from "../helpers/AuthHandler";
import { AxiosRequestConfig } from "axios";

const Http = httpFactory(HttpConfig);

// Add authorization
// Http.interceptors.request.use(AuthInterceptorFactory((requestConfig: AxiosRequestConfig) => !!AuthHandler.auth));

// Add API error detection
Http.interceptors.response.use((res: any) => res, ApiErrorInterceptor);

export { Http };
