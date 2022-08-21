import {HardhatUserConfig, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-truffle5";
import "@nomicfoundation/hardhat-chai-matchers";

require('dotenv').config();
const {RINKEBY_URL, PRIVATE_KEY} = process.env;


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 400000
  },
  networks: {
    hardhat: {
    },
    ganache: {
      timeout: 1000000,
      url: "http://0.0.0.0:7545",
      accounts: ["af500fa9b5221dcf83977d0167ca7bd96d3d03d70de117ef9571fff00d8b407c", "dc9470da99a9e5dd48a582cba7f27f1da173a321141efb83dea55b59055e7549"],
      gasPrice: 5000000000,
    },
    rinkeby: {
      gasPrice: 40000000000,
      url: RINKEBY_URL,
      accounts: [`${PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: '48KNX1MVPM72747KJ9Q813V878A22B67DD'
  }
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
