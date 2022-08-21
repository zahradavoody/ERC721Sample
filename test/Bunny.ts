import {expect} from "chai";
import hre, {ethers, web3} from "hardhat";

function generateAccounts(count: number): string[] {
  const accounts = [];
  for (let i = 0; i < count; i++) {
    accounts.push(web3.eth.accounts.create().address);
  }
  return accounts;
}

describe("Bunny", function () {

  describe("BaseURI", function () {

    it("Should check setBaseURI method", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.setBaseURI("http://api2.bunny.example.com/");
      expect(await bunny.baseURI()).to.equal("http://api2.bunny.example.com/");
    });
  });

  describe("whitelist", function () {
    it("Should add to whitelist", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addToWhitelist(otherAccount.address);
      expect(await bunny.isWhitelisted(otherAccount.address)).to.be.true;
    });

    it("Should remove from whitelist", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addToWhitelist(otherAccount.address);
      await bunny.removeFromWhitelist(otherAccount.address);
      expect(await bunny.isWhitelisted(otherAccount.address)).to.be.false;
    });

    it("Should bulk add to whitelist", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      const addresses = generateAccounts(250);
      await bunny.bulkAddToWhitelist(addresses);
      for (const address of addresses) {
        expect(await bunny.isWhitelisted(address)).to.be.true;
      }
    });

    it("Should bulk remove from whitelist", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      const addresses = generateAccounts(250);
      await bunny.bulkAddToWhitelist(addresses);
      await bunny.bulkRemoveFromWhitelist(addresses);
      for (const address of addresses) {
        expect(await bunny.isWhitelisted(address)).to.be.false;
      }
    });
  })

  describe("giftMint", function () {
    it("Should call with non-privileged account", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();

      await bunny.toggleGiftOpened();
      await expect(bunny.connect(otherAccount).giftMint(2)).to.be.revertedWithoutReason();
      await expect(await bunny.balanceOf(otherAccount.address)).to.be.equal(0);
    });

    it("Should call with privileged account", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addToWhitelist(otherAccount.address);
      await bunny.toggleGiftOpened();
      await expect(await bunny.connect(otherAccount).giftMint(2)).not.to.be.reverted;
      await expect(await bunny.balanceOf(otherAccount.address)).to.be.equal(2);
    });
  });

  describe("mint", function () {
    it("Should call before minting open", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();

      await expect(bunny.connect(otherAccount).mint(1, {value: '10000000000000000'})).to.be.revertedWith("minting is not started");
    });

    it("Should call invalid count", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();

      await bunny.start();
      await expect(bunny.connect(otherAccount).mint(30, {value: '300000000000000000'})).to.be.revertedWith("max count is 20");
    });

    it("Should call with insufficient value", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();

      await bunny.start();
      await expect(bunny.connect(otherAccount).mint(3, {value: 1000000000})).to.be.revertedWith("invalid value");
    });

  });

  describe("withdraw", function () {
    it("Should withdraw funds", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();

      await bunny.start();
      await bunny.connect(otherAccount).mint(1, {value: '10000000000000000'});
      await expect(await bunny.withdraw()).to.be.ok;
    });
  });

});
