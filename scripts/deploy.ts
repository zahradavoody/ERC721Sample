import { ethers } from "hardhat";

async function main() {
  const Bunny = await ethers.getContractFactory("Bunny");

  // Start deployment, returning a promise that resolves to a contract object
  // @ts-ignore
  const instance = await Bunny.deploy(); // Instance of the contract
  await instance.deployed();

  console.log("Contract deployed to address:", instance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
