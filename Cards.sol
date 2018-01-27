pragma solidity ^0.4.18;

contract Cards {
	
	uint noOfProposals = 0;
	
	struct Proposal {
		string text;
		uint index;
		uint upvotes;
		uint downvotes;
		uint totalvotes;
	}
	
	struct Voter {
		address at;
		uint index;
		bool[] voted;
	}

	address public admin;
	uint public vindex;

	Voter[] public voters;
	Proposal[] public proposals;

	function Cards() {
		admin = msg.sender;
		for (uint i = 0; i < proposals.length; i++) {
			proposals[i].totalvotes = 0;
			proposals[i].upvotes = 0;
			proposals[i].downvotes = 0;
		}
	}

	function init() public {
		bool found = false;
		uint vi = 0;
		for( uint i = 0; i < voters.length; i++ ) {
			if(voters[i].at == msg.sender) {
				found = true;
				vi = i;
				break;
			}
		}
		if(found == false ) {
			vi = voters.length;
			voters.push(Voter({at: msg.sender,
				index: vi,voted: new bool[](proposals.length)}));
				voters[vi].at = msg.sender;
		}

		vindex = vi;
		
	}

	function getNoOfProposals() public constant returns(uint) {
		return noOfProposals;
	}

	
	function vote(uint pindex, bool support) public returns(bool) {
		
		voters[vindex].voted[pindex] = true;
		proposals[pindex].totalvotes += 1;
		if( support == true ) proposals[pindex].upvotes += 1;
		else proposals[pindex].downvotes += 1;
		return true;
	}

	function propose(string text) public {
		proposals.push(Proposal({text: text, index: proposals.length-1,upvotes:0,downvotes:0,totalvotes:0}));
		noOfProposals = proposals.length;
		for(uint i = 0; i < voters.length; i++) {
		    voters[i].voted.push(false);
		}
	}

}
