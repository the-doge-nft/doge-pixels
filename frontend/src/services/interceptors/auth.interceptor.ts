import {AxiosRequestConfig} from "axios";
import AuthHandler from "../../helpers/AuthHandler";

const AuthInterceptorFactory = (shouldAddToken: any) => {
    return async (requestConfig: AxiosRequestConfig) => {
        if (shouldAddToken(requestConfig)) {
            const auth = AuthHandler.auth;
            if (!auth) {
                throw new TypeError("This should never happen");
            }
            const accessKey = auth.AccessToken
            requestConfig.headers['Content-Type'] = 'application/json'
            requestConfig.headers['i2-ACCESS-KEY'] = accessKey
        }
        return requestConfig;
    };
};

export {AuthInterceptorFactory as default};
