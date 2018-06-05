export const Abi =[
	{
		"constant": true,
		"inputs": [
			{
				"name": "gameName",
				"type": "string"
			}
		],
		"name": "getPlayers",
		"outputs": [
			{
				"name": "",
				"type": "address[5]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gameName",
				"type": "string"
			},
			{
				"name": "players",
				"type": "uint256"
			}
		],
		"name": "join",
		"outputs": [
			{
				"name": "",
				"type": "address[5]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "gameName",
				"type": "string"
			}
		],
		"name": "getDealer",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "gameName",
				"type": "string"
			}
		],
		"name": "isGameFull",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]