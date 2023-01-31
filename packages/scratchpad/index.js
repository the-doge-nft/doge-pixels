const axios = require("axios");
const crypto = require("cryptos");

const main = async () => {
  const algo = "SHA256";
  const data = "";
  const pubKey =
    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEflgGqpIAC9k65JicOPBgXZUExen4rWLq05KwYmZHphTU/fmi3Oe/ckyxo2w3Ayo/SCO/rU2NB90jtCJfz9i1ow==";
  const signature = "";
  const isVerified = crypto.verify(algo, Buffer.from(data), pubKey, signature);
  return;
};

main().then(() => process.exit(1));
