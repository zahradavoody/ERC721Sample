# Sample ERC721 Project

This project demonstrates a sample ERC721 smart contract. It comes with tests for that contract and a script that deploys that contract.
In this project only addresses that are in whitelist can mine. For this purpose we developed a whitelist smart contract that the main smart contract inherited from it.
### Compile Project  
```shell
npx hardhat compile
```  

### Run Tests  
```shell
npx hardhat test
```

### Deploy Contract  
```shell
npx hardhat run scripts/deploy.ts
```  

_This contract is deployed on ropsten test network at **[0x35733373c01d7b0cf53824bb3ae6c1a503e1dd8d](https://ropsten.etherscan.io/address/0x35733373c01d7b0cf53824bb3ae6c1a503e1dd8d)**_
  

