const isProduction = () => {
  return process.env.NODE_ENV === "production" && process.env.REACT_APP_CARAMBA_ENV === "aws_production";
};
const isStaging = () => {
  return process.env.NODE_ENV === "production" && process.env.REACT_APP_CARAMBA_ENV === "aws_develop";
};
const isDevModeEnabled = () => {
  return process.env.NODE_ENV === "development";
};
export { isStaging, isProduction, isDevModeEnabled };
