# Ethereum-Charity-Donation-DApp
Building an application to create a payment portal for charity organisations. The app will be built on an ethereum test network.


## Extracting the data from https://www.99acres.com/

Clone the repository:

```
git clone https://github.com/ishanmadan1996/Ethereum-Charity-Donation-DApp.git
```

Install the pre-requisite libraries:

```
npm install -g ethereumjs-testrpc truffle
```
```
npm install -g truffle
```
```
npm install web3
```
In order to start our test ethereum network we run the testrpc command in powershell. The testrpc command also provides us with 10 default nodes on the ethereum network, so that we can use these accounts for testing purposes.

```
testrpc
```


The 'contracts' folder contains the solidity contract we have deployed on to our test network. The smart contract is coded in Solidity and it provides the function of sending money to other test nodes in our network, along with other functions to track our transaction and get current balance:

```
MetaCoin.sol
```

In order to compile our smart contracts and deploy them on to our test network, we use the following commands:

```
truffle compile -all

truffle migrate -reset
```
Now to run our web application on localhost, we run the following command in powershell:

```
npm run dev
```

## Built With

* [Solidity](https://solidity.readthedocs.io/en/v0.4.24/contracts.html) - The scripting language used to write smart contracts.

* [Web3 js](https://web3js.readthedocs.io/en/1.0/) - Ethereum JavaScript API used to interact with the Ethereum test nodes.

* [Truffle](https://truffleframework.com/docs/truffle/reference/configuration) - Truffle is a framework for rapid development, testing and deployment of smart contracts with Solidity and Javascript.

## Authors

* **Ishan Madan** - [ishanmadan1996](https://github.com/ishanmadan1996)
* **Monil Jain** - [mjain01](https://github.com/mjain01)
