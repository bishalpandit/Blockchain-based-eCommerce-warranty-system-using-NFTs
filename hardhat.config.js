require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path:__dirname+'/.env'})
/** @type import('hardhat/config').HardhatUserConfig */
const projectId = process.env.PROJECT_ID 
const privateKey = process.env.PRIVATE_KEY
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337 //config happen accordiing to hardhat documentation
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://rpc-mainnet.maticvigil.com/v1/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.9",
};
