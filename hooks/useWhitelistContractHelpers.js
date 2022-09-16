import { useState } from "react";
// Variables and Function specific to the whitelist contract
export function useWhitelistContractHelpers({ instantiateContract }) {
	const [hasUserJoinedWhitelist, setHasUserJoinedWhitelist] = useState(false);
	const [numberOfWhitelistedUsers, setNumberOfWhitelistedUsers] = useState(0);
	const [isAddingAddressToWhitelist, setIsAddingAddressToWhitelist] = useState(false);

	const addAddressToWhitelist = async () => {
		try {
			const { contract: whitelistContract } = await instantiateContract(true);
			const tx = await whitelistContract.addAddressToWhitelist();

			setIsAddingAddressToWhitelist(true);

			// wait for transaction to get minted
			await tx.wait();

			setIsAddingAddressToWhitelist(false);

			await getNumberOfWhitelisted();
			setHasUserJoinedWhitelist(true);
		} catch (err) {
			console.log(err);
			alert(err);
		}
	};

	const getNumberOfWhitelisted = async () => {
		try {
			const { contract: whitelistContract } = await instantiateContract();
			const _numOfWhitelistedUsers = await whitelistContract.numAddressesWhitelisted();

			setNumberOfWhitelistedUsers(_numOfWhitelistedUsers);
		} catch (err) {
			console.log(err);
		}
	};

	const checkIfAddressInWhitelist = async () => {
		try {
			// THIS IS A READ OPERATION SO NOT SURE WHY WE NECESSARILY HAVE TO USE A SIGNER
			const { contract: whitelistContract, provider: signer } = await instantiateContract(true);
			const address = await signer.getAddress();
			const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
			setHasUserJoinedWhitelist(_joinedWhitelist);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		addAddressToWhitelist,
		getNumberOfWhitelisted,
		checkIfAddressInWhitelist,
		hasUserJoinedWhitelist,
		numberOfWhitelistedUsers,
		isAddingAddressToWhitelist,
	};
}
