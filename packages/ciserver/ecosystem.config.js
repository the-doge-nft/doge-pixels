module.exports = {
  apps: [
    {
      name: "ciserver",
      script: "index.js",
      watch: ".",
    },
    {
      script: "./service-worker/",
      watch: ["./service-worker"],
    },
  ],
};
