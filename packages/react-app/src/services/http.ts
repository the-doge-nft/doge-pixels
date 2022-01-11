import axios, { AxiosRequestConfig } from "axios";
import env from "../environment";

const HttpConfig: AxiosRequestConfig = {};
if (env.api.proxyURL !== null && env.api.proxyURL !== undefined) {
  HttpConfig.baseURL = env.api.proxyURL;
  HttpConfig.headers = {
    "x-api-proxy-dst-host": env.api.baseURL,
  };
} else {
  HttpConfig.baseURL = env.api.baseURL;
}

const httpFactory = (HttpConfig: AxiosRequestConfig) => {
  return axios.create(HttpConfig);
};

export { httpFactory, HttpConfig };
