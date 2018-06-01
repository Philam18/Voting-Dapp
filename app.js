// Ganache (TestRPC) is a simulated in-memory private blockchain
var ganache = require("ganache-cli");
// web3 is an RPC that interacts with Ganache
var Web3 = require('web3');

// FileHandler will read our Solidity contract into a buffer
// solidity compiler will compile the contract
var solc = require('solc');
var fs = require('fs');

// Every contract requires the address of its creator, which allows every transaction to this
// contract to reference
var creator;

var web3 = new Web3(ganache.provider());
console.log('-----------------------------------------------');
console.log('Web3 instance connected to Ganache node.');
console.log('Web3 version:' + web3.version);

/*
  Test Web3 connection to blockchain through request
*/
web3.eth.getAccounts().then((accounts)=>{
  // The first account generated by Ganache is arbitrarily used as a creator
  creator = accounts[0];
  console.log('Generated Accounts:');
  console.log(accounts);
  readFile('./Voting.sol');
});

/*
  Read Smart Contract code into buffer
*/
function readFile(file){
  console.log(`-----------------------------------------------`);
  console.log(`Attempting to read solidity Smart Contract ...`);
  fs.readFile(file,(err, code)=>{
    if(err) return console.log('Error reading:\n' + err);
    console.log('Successfully read Smart Contract into buffer.');
    compileSmartContract(code.toString());
  });
}

/*
  Compile Smart Contract code to Byte-code
*/
function compileSmartContract(code){
  console.log(`-----------------------------------------------`);
  console.log('Attempting to compile Smart Contract ...');
  compiledCode = solc.compile(code);
  if(compiledCode.errors) return console.log('Error in Smart Contract code:\n' + compiledCode.errors);
  console.log('Successfully compiled Smart Contract.');
  deploySmartContract(compiledCode);
}

/*
  Take an ABI definition and deploy it to the TestRPC
*/
function deploySmartContract(compiledCode){
  console.log('-----------------------------------------------');
  console.log('Attempting to deploy Smart Contract ...');
  // The json interface is a json object describing the Application Binary Interface (ABI)
  // for an Ethereum smart contract.
  // The ABI is what is used to interact with the smart contract
  // while it is deployed on the blockchain
  // From the docs:
  //    "When you create a new contract object you give it the json interface of the
  //    respective smart contract and web3 will auto convert all calls into low level ABI
  //    calls over RPC for you."
  var jsonABI = JSON.parse(compiledCode.contracts[':Voting'].interface);
  var byteCode = compiledCode.contracts[':Voting'].bytecode.toString(); // bytecode to be compiled by EVM
  var gasLimit = 1000000; // The maximum gas willing to be paid for a transaction (gas limit).
  var defaultGasPrice = '20000000000000'; // Default gas price in Wei
  var contractParameters = ['Rama', 'Nick', 'Jokes']; // Our candidate list
  // Creates a new instance of the contract
  var votingContract = new web3.eth.Contract(jsonABI);
  // Attempts to deploy the contract, and returns a function 'send'
  votingContract.deploy({byteCode, contractParameters}).send({
    from      : creator,
    gas       : gasLimit,
    gasPrice  : defaultGasPrice
  }).on('error', (error)=>{
    console.log('Error encountered while deploying:\n' + error);
  }).then((deployedContract)=>{
    console.log('Successfully deployed Smart Contract');
    console.log('Contract Address: ' + deployedContract.address);
  });
}
