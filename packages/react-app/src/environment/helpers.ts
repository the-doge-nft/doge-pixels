const isProduction = () => {
  return process.env.NODE_ENV === "production" && process.env.REACT_APP_DOG_ENV === "production";
};
const isStaging = () => {
  return process.env.NODE_ENV === "production" && process.env.REACT_APP_DOG_ENV === "staging";
};
const isDevModeEnabled = () => {
  return process.env.NODE_ENV === "development";
};
export { isStaging, isProduction, isDevModeEnabled };
