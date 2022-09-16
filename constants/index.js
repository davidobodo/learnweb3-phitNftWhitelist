const WHITELIST_CONTRACT_ADDRESS = "0xC62EEfe06F1f69C3010ab44F4581B1329F938D31";

const abi = [
	{
		inputs: [
			{
				internalType: "uint8",
				name: "_maxWhitelistedAddresses",
				type: "uint8",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "addAddressToWhitelist",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "maxWhiltelistedAddresses",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "numAddressesWhitelisted",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "whitelistedAddresses",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

export { abi, WHITELIST_CONTRACT_ADDRESS };
