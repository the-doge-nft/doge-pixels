const developmentEnv = {
  appEnv: "development",
  api: {
    baseURL: "test",
    proxyURL: "http://localhost:8001"
  },
  redirectAfterLogoutURL: "/",
};
export default developmentEnv;
