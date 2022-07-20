const isProduction = () => {
  // return process.env.NODE_ENV === "production" && process.env.REACT_APP_DOG_ENV === "aws_production";
  return true
};
const isStaging = () => {
  return process.env.NODE_ENV === "production" && process.env.REACT_APP_DOG_ENV === "aws_develop";
};
const isDevModeEnabled = () => {
  return process.env.NODE_ENV === "development" || process.env.REACT_APP_DOG_ENV === "surge_staging";
};
export { isStaging, isProduction, isDevModeEnabled };
