
//  Requires web3 and ganache
var Web3 = require('web3');
var ganache = require("ganache-cli");

// Requires FileHandler to read our Solidity code into a buffer
// Requires the solidity compiler
var solc = require('solc');
var fs = require('fs');

// web3 is an RPC that interacts with TestRPC (Ganache),
// which is a simulated in-memory private blockchain

var web3 = new Web3(ganache.provider());
console.log("---------------------------------------------------------------------------------");
console.log("                 Web3 instance connected to Ganache node");
console.log("---------------------------------------------------------------------------------");
console.log(web3.version);

// Test Web3 connection to blockchain through request
web3.eth.getAccounts().then((accounts)=>{
  console.log("---------------------------------------------------------------------------------");
  console.log("     Dipslay a list of all Ethereum accounts on the simulated blockchain");
  console.log("---------------------------------------------------------------------------------");
  console.log(accounts);
  readFile('./Voting.sol');
});

// Read Smart Contract code into buffer
function readFile(file){
  fs.readFile(file,(err, code)=>{
    if(err){
      console.log("---------------------------------------------------------------------------------");
      console.log("                              Error reading file");
      console.log("---------------------------------------------------------------------------------");
      console.log(err);
      return;
    }
    console.log("---------------------------------------------------------------------------------");
    console.log("                  Smart Contract successfully read into filestream");
    console.log("---------------------------------------------------------------------------------");
    console.log(code);
    compileSmartContract(code.toString());
  });
}

// Compile Smart Contract code to Byte-code
function compileSmartContract(code){
  compiledCode = solc.compile(code);
  console.log("---------------------------------------------------------------------------------");
  console.log("       compiled smart contract, displaying bytecode");
  console.log("---------------------------------------------------------------------------------");
  var byteCode = compiledCode.contracts[':Voting'].bytecode;
  console.log(byteCode);
  console.log("---------------------------------------------------------------------------------");
  console.log("          JSON interface of smart contract definition");
  console.log("---------------------------------------------------------------------------------");
  // The json interface is a json object describing the Application Binary Interface (ABI)
  // for an Ethereum smart contract.
  // The ABI is what is used to interact with the smart contract
  // while it is deployed on the blockchain
  var abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
  console.log(abiDefinition);
  deploySmartContract(abiDefinition);
}

// Take an ABI definition and deploy it to the TestRPC
function deploySmartContract(abiDefinition){
  var VotingContract = web3.eth.contract(abiDefinition);
}
