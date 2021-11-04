require("@nomiclabs/hardhat-waffle");

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/5eb24db4e98649c5880292cfe2e23139",
      accounts: [privateKey]
    },
  },
  solidity: "0.8.0",
};
