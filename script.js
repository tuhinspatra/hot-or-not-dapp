Web3=require('web3');
web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545/") );
abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"text","type":"string"},{"name":"index","type":"uint256"},{"name":"upvotes","type":"uint256"},{"name":"downvotes","type":"uint256"},{"name":"totalvotes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"text","type":"string"}],"name":"propose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vindex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pindex","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNoOfProposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"voters","outputs":[{"name":"at","type":"address"},{"name":"index","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
ethvote = web3.eth.contract(abi).at('0x89f2b76d331a01318c60c75556c69a8e90941732');


function createContent() {
	var data = "<div>";
	for (var i=0; i < parseInt(ethvote.getNoOfProposals.call()); i++) {
		data += '<div index-data="' + i + '" class="card"> <span class="upvote-cnt">' + 
		ethvote.proposals.call(i)[2].c[0].toString() + '</span> <span class="downvote-cnt">' + 
		ethvote.proposals.call(i)[3].c[0].toString() + '</span> <span class="totalvote-cnt">' + 
		ethvote.proposals.call(i)[4].c[0].toString() + '</span>' + ethvote.proposals.call(i)[0].toString() + "</div>";

		var vindex = parseInt(ethvote.vindex.call().c[0].toString());
		console.log("vindex:" + ethvote.vindex.call());

		/*if(ethvote.voters.call(vindex)[2][i].toString == 'true') {
			console.log("already voted " + i);
		} else {
			console.log("can vote " + i);
		}*/

		
	}
	data += "</div>";
	$("#content").html(data);
	$('<input class="upbtn" value="upvote" type="button">').appendTo(".card");
	$('<input class="downbtn" value="downvote" type="button">').appendTo(".card");

	$('.upbtn').click(function(){
		console.log("Balance: " + web3.eth.getBalance(web3.eth.accounts[0]));
		var pindex = parseInt($(this).parent().attr("index-data"));
		console.log(pindex);
        ethvote.vote(pindex+"",true, {from:web3.eth.accounts[0], gas:3000000});
	});

	$('.downbtn').click(function(){
		var pindex = $(this).parent().attr("index-data");
        ethvote.vote(pindex,false,{from:web3.eth.accounts[0],gas:3000000});
	});


}

$(function() {
	ethvote.init.call({from:web3.eth.accounts[0],gas:3000000});
	createContent();
});

function createProposal() {
	text=$("#proptext").val();
	ethvote.propose(text, {from: web3.eth.accounts[0], gas: 300000});
	createContent();
}

