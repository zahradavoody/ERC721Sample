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

  describe("owner", function () {

    it("Should check contract owner", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();
      // assert that the value is correct
      expect(await bunny.owner()).to.equal("0x7716b4A9aB9330C9D619B7D238a205c004aA1Eaf");
    });
  });

  describe("BaseURI", function () {
    it("Should check baseURI value which set via constructor", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();
      // assert that the value is correct
      // @ts-ignore
      expect(await bunny.baseURI()).to.equal();
    });

    it("Should check setBaseURI method", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();

      await bunny.setBaseURI("http://api2.bunny.example.com/");
      // assert that the value is correct
      // @ts-ignore
      expect(await bunny.baseURI()).to.equal("http://api2.bunny.example.com/");
      // @ts-ignore
      expect(await bunny.baseURI()).to.not.equal();
    });
  });

  describe("redeemer", function () {
    it("Should add a redeemer", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      await bunny.addRedeemer(otherAccount.address);
      expect(await bunny.isWhitelisted(otherAccount.address)).to.be.true;
    });

    it("Should remove a redeemer", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addRedeemer(otherAccount.address);
      expect(await bunny.isWhitelisted(otherAccount.address)).to.be.true;
      await bunny.removeRedeemer(otherAccount.address);
      expect(await bunny.isWhitelisted(otherAccount.address)).to.be.false;
    });

    it("Should bulk add redeemers", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const addresses = generateAccounts(250);
      await bunny.bulkAddRedeemers(addresses);
      for (const address of addresses) {
        expect(await bunny.isWhitelisted(address)).to.be.true;
      }
    });

    it("Should bulk remove redeemers", async function () {
      const [owner, otherAccount] = await ethers.getSigners();
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const addresses = generateAccounts(250);
      await bunny.bulkAddRedeemers(addresses);
      await bunny.bulkRemoveRedeemers(addresses);
      for (const address of addresses) {
        expect(await bunny.isWhitelisted(address)).to.be.false;
      }
    });
  })

  describe("redeemMint", function () {
    it("Should call with non-privileged account", async function () {

      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();

      const [owner, otherAccount] = await ethers.getSigners();
      await bunny.toggleRedeemOpened();
      await expect(bunny.connect(otherAccount).redeemMint(2)).to.be.revertedWithoutReason();
      await expect(await bunny.balanceOf(otherAccount.address)).to.be.equal(0);
    });

    it("Should call with privileged account", async function () {
      const [owner, otherAccount] = await ethers.getSigners();

      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addRedeemer(otherAccount.address);
      await bunny.toggleRedeemOpened();
      await expect(await bunny.connect(otherAccount).redeemMint(2)).not.to.be.reverted;
      await expect(await bunny.balanceOf(otherAccount.address)).to.be.equal(2);
    });

    /*it("Should call with invalid count", async function () {
      const [owner, otherAccount] = await ethers.getSigners();

      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();

      await bunny.addRedeemer(otherAccount.address);
      await bunny.toggleRedeemOpened();
      await expect(await bunny.connect(otherAccount).redeemMint(251)).to.be.reverted;
    });*/
  });

  describe("mint", function () {
    it("Should call invalid count", async function () {

      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();

      const [owner, otherAccount] = await ethers.getSigners();
      await expect(bunny.connect(otherAccount).mint(30, {value: 0})).to.be.reverted;
    })

    it("Should call with insufficient value", async function () {

      const Bunny = await hre.ethers.getContractFactory("Bunny");
      // @ts-ignore
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();
      await expect(bunny.connect(otherAccount).mint(1, {value: 1000000000})).to.be.reverted;
    });

  });

  describe("withdraw", function () {
    it("Should withdraw funds", async function () {
      const Bunny = await hre.ethers.getContractFactory("Bunny");
      const bunny = await Bunny.deploy();
      const [owner, otherAccount] = await ethers.getSigners();
      await bunny.connect(otherAccount).mint(1, {value: '55000000000000000'});
      await expect(await bunny.withdraw()).to.be.ok;
    });
  });

});
