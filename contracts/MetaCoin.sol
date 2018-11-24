pragma solidity ^0.4.24;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	struct Location{
		string name;
        address Receiver;
		address PreviousLocationId;
        uint Timestamp;
		uint amount;
		 
    }
	mapping(address=>string) getID;
	mapping(string=>Location) ID;
    mapping(uint=>Location) Trail;
	uint8 TrailCount=0;
    mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		balances[tx.origin] = 10000;
	}


	function sendCoin(address receiver, uint amount,string name,string id) public returns(bool sufficient) {
		Location memory newLocation;
        newLocation.Receiver = receiver;
        newLocation.Timestamp = now;
		newLocation.name = name;
		newLocation.amount = amount;
		getID[receiver] = id;
        if(TrailCount!=0)
        {
            newLocation.PreviousLocationId= Trail[TrailCount].Receiver;
        }
        Trail[TrailCount] = newLocation;
		ID[id] = Trail[TrailCount];
        TrailCount++;
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}
	function getInfoPrevious(address receiver) public returns(string,uint,string){
		string id = getID[receiver];
		if (bytes(id).length == 0){
			return ("Null",0,id);
		}
		return (ID[id].name,ID[id].amount,id);
	}
	function getTransactionByID(string id) public returns(uint,string,address) {
		
		return (ID[id].amount,ID[id].name,ID[id].Receiver);
	}

 	function GetTrailCount() public returns(uint8){
        return MetaCoin.TrailCount;
    }
    function GetLocation(uint8 TrailNo) public returns (string,uint,address)
    {
        return (Trail[TrailNo].name,Trail[TrailNo].amount,Trail[TrailNo].Receiver);
    }
	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
	function getaddress() public view returns(address) {
		return msg.sender;
	}
	
}
