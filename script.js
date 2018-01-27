Web3=require('web3');
web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545/") );
abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"text","type":"string"},{"name":"index","type":"uint256"},{"name":"upvotes","type":"uint256"},{"name":"downvotes","type":"uint256"},{"name":"totalvotes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"text","type":"string"}],"name":"propose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pindex","type":"uint256"},{"name":"support","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"voted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNoOfProposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
ethvote = web3.eth.contract(abi).at('0x3bdbca13d266841c68afa8628947c1146b842ebb');


function createContent() {
	var data = "<div>";
	for (var i=0; i < parseInt(ethvote.getNoOfProposals.call()); i++) {
		data += '<div index-data="' + i + '" class="card"> <span class="upvote-cnt">' + 
		ethvote.proposals.call(i)[2].c[0].toString() + '</span> <span class="downvote-cnt">' + 
		ethvote.proposals.call(i)[3].c[0].toString() + '</span> <span class="totalvote-cnt">' + 
		ethvote.proposals.call(i)[4].c[0].toString() + '</span>' + ethvote.proposals.call(i)[0].toString() + "</div>";

		var oldvote = parseInt(ethvote.voted.call(web3.eth.accounts[0],i).c[0].toString()); 
		
		if(oldvote == 1) {
			console.log("already voted yes: " + i);
		} else if (oldvote == 2) {
			console.log("already voted no: " + i);
		} else {
			console.log("can vote: " + i);
		}

		
	}
	data += "</div>";
	$("#content").html(data);
	$('<input class="upbtn" value="upvote" type="button">').appendTo(".card");
	$('<input class="downbtn" value="downvote" type="button">').appendTo(".card");

	$('.upbtn').click(function(){
		console.log("Balance: " + web3.eth.getBalance(web3.eth.accounts[0]));
		var pindex = parseInt($(this).parent().attr("index-data"));
		console.log(pindex);
        ethvote.vote(pindex,1, {from:web3.eth.accounts[0], gas:3000000});
	});

	$('.downbtn').click(function(){
		var pindex = $(this).parent().attr("index-data");
        ethvote.vote(pindex,2,{from:web3.eth.accounts[0],gas:3000000});
	});


}

$(function() {
	createContent();
});

function createProposal() {
	text=$("#proptext").val();
	ethvote.propose(text, {from: web3.eth.accounts[0], gas: 300000});
	createContent();
}

