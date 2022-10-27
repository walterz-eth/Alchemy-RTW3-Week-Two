import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.GOERLI_URL,
      //accounts: "remote", // Using node's accounts  
      accounts: {
        mnemonic: process.env.PRIVATE_KEY,
        path: "",
        initialIndex: 0,
        count: 10
      }
    },
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