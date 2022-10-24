import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    hardhat: {
    },
    /*rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      accounts: "remote", // Using node's accounts  
    },*/
    ganache: {
	    url: "http://127.0.0.1:8545",
      accounts: "remote", // Using node's accounts
      from: "0x1" // Default sender. e.g. this account will be default owner of deployed contract
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./scripts"
  },
  mocha: {
    timeout: 40000
  }
}