# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# Steps to Create Project  
```shell
npm init
npm install --save-dev hardhat
```  
## Initialize hardhat sample project  
```shell
npx hardhat
```  
Choose Typescript sample project and proceed to save dependencies.  

#### Compile Project  
```shell
npx hardhat compile
```  

### Run Tests  
```shell
npx hardhat test
```

### Deploy Contract  
```shell
npx hardhat run scripts/deploy.ts --network ganache
```  

### Verify Contract Source on Etherscan  
See here:  
https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan  
Example:  
```shell
npx hardhat verify --network rinkeby 0x65b3ce52d95918b4e73afbf68306b0742c94e136 "http://api.bunny.example.com/"
```
