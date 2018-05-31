/*
  This Smart Contract is based off of: https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2?ref=dappnews
  More informaiton on how to read the Smart Contract here: https://solidity.readthedocs.io/en/develop/introduction-to-smart-contracts.html#subcurrency-example
*/

// Specifies the version of Solidity this contract was written in (intended for the compiler)
pragma solidity ^0.4.18;

contract Voting {
  /*
    The keyword public specifies auto-generation of a function that allows access to state variables
    from outside (i.e. the Blockchain) the context of the Smart Contract
  */

  /*
    The type 'address' is an Ethereum address. Ethereum addresses are 160-bit values (20-bytes).
          E.g
            0x 77 48 33 F4 0c 86 bE 2d 26 7e F4 Cc bC 58 31 D7 54 06 3b c9
    Each byte is represented by 2 hex-characters. This makes an address 42 hex-characters long,
    which includes the '0x' prefix indicating hexcidecimal-base.

    The mapping below creates an associative array of Ethereum addresses to an 8-bit integer value.
    This 8-bit value represents the amount of votes each address has received.
  */
  mapping (address => uint8) public votesReceived;


  /*
    The state variable candidateList, which as its name implies, is a list/array of all votable
    addresses.
  */
  address[] public candidateList;

  /*
    The constructor can only be called once when it is deployed to the blockchain.
    'candidateNames' is an array of candidates/addresses that are votable
  */
  function Voting(address[] candidateNames) public {
    candidateList = candidateNames;
  }

  /*
    Check the total votes a candidate has recieved
  */
  function totalVotesFor(address candidate) view public returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  /*
    Vote for a candidate
  */
  function voteForCandidate(address candidate) public {
    require(validCandidate(candidate));
    votesReceived[candidate] += 1;
  }

  /*
    Check if an candidate is valid
  */
  function validCandidate(address candidate) view public returns (bool) {
    return candidateList.indexOf(candidate) > -1;
  }
}
