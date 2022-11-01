import { AxiosError } from "axios";
// import { FORM_ERROR } from "final-form";

import { showErrorToast } from "../../DSL/Toast/Toast";
import ApiError from "../exceptions/api.error";
// import Sentry from "../../sentry";

const MFA_ERROR_MESSAGE = "MFA is on. mfa_code must be set";
const RESTRICTED_ERROR_MESSAGE = "Access Restricted";
const INVALID_2FA_MESSAGE = "Invalid 2FA code";
const WRONG_PASSWORD_MESSAGE = "Wrong password";
const EXPIRED_TOKEN_MESSAGE = "ExpiredToken";

const logRequestInfoForSentryTracking = (config: AxiosError) => {
  // if (Sentry.isEnabled && config && config.response) {
  //     // we want the response to be visible in sentry logs
  //     console.log("Axios Error Interceptor:", {
  //         // request_data: config.config.data,
  //         response: config.response.data
  //     });
  // }
};

const ApiErrorInterceptor = (config: AxiosError) => {
  if (config.response) {
    if (config.response.status === 500) {
      showErrorToast("500 Error");
      logRequestInfoForSentryTracking(config);
    } else if (config.response.data && config.response.data.message) {
      if (config.response.data.message === MFA_ERROR_MESSAGE) {
        // throw new MfaError("2FA must be enabled");
      } else if (config.response.data.message === RESTRICTED_ERROR_MESSAGE && config.response.data.redirect_url) {
        // throw new AccessRestrictedError(config.response.data.message, config.response.data.redirect_url);
      } else {
        throw new ApiError(config.response.data.message);
      }
    } else if (config.response.status === 400) {
      showErrorToast(`400 Received`);
      logRequestInfoForSentryTracking(config);
    } else if (config.response.status === 401) {
      if (
        config.response.data.reason === INVALID_2FA_MESSAGE ||
        config.response.data.reason === WRONG_PASSWORD_MESSAGE
      ) {
        // throw new MfaVerificationError(config.response.data.reason);
      } else if (config.response.data.reason === EXPIRED_TOKEN_MESSAGE) {
        console.log("expired token, logging out");
        // AppStore.auth.logout()
      } else {
        console.log("got 401, token not expired, logging out");
        // AppStore.auth.logout()
      }
    }
  }
  throw config;
};

export default ApiErrorInterceptor;
