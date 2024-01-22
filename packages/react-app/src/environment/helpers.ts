const isProduction = () => {
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DOG_ENV === "production";
};

console.log(
  process.env.NODE_ENV,
  process.env.NEXT_PUBLIC_DOG_ENV
)
const isStaging = () => {
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DOG_ENV === "staging";
};
const isDevModeEnabled = () => {
  return process.env.NODE_ENV === "development";
};
export { isDevModeEnabled, isProduction, isStaging };

