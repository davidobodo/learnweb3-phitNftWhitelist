import Head from "next/head";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";
import { useWhitelistContractHelpers } from "../hooks/useWhitelistContractHelpers";
import { useEthProviderConnection } from "../hooks/useEthProviderConnection";
import { Particle, Loader, Button } from "../components";

export default function Home() {
	const web3ModalRef = useRef();
	const getProviderOrSigner = async (needSigner = false) => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);
		const { chainId } = await web3Provider.getNetwork();

		if (chainId !== 4) {
			alert("Change the network to Rinkeby");
			throw new Error("Change network to Rinkeby");
		}
		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		return web3Provider;
	};

	const instantiateContract = async (needSigner = false) => {
		const provider = await getProviderOrSigner(needSigner);
		const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);

		return {
			contract,
			provider,
		};
	};

	const {
		hasUserJoinedWhitelist,
		numberOfWhitelistedUsers,
		addAddressToWhitelist,
		getNumberOfWhitelisted,
		checkIfAddressInWhitelist,
	} = useWhitelistContractHelpers({
		instantiateContract,
	});

	const {
		currentChainId,
		isUsersWalletConnected,
		hasMetamask,
		isCheckingProvider,
		checkIfUserHasProvider,
		connectedWallets,
	} = useEthProviderConnection();

	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
		} catch (err) {
			console.log(err, "THE ERROR WHEN CONNECTING TO WALLET");
		}
	};

	const onConnectWallet = async () => {
		if (!hasMetamask) {
			alert("Error: Please install metamask and try again");
			return;
		}

		connectWallet();
	};

	const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(false);
	const onCheckWhitelist = async () => {
		setIsCheckingWhitelist(true);

		try {
			await checkIfAddressInWhitelist();
			await getNumberOfWhitelisted();
		} catch (err) {
		} finally {
			setIsCheckingWhitelist(false);
		}
	};
	useEffect(() => {
		if (isUsersWalletConnected && connectedWallets.length > 0) {
			onCheckWhitelist();
		}
	}, [isUsersWalletConnected && connectedWallets.length]);

	// Instantiate web3modal
	useEffect(() => {
		web3ModalRef.current = new Web3Modal({
			network: "rinkeby",
			providerOptions: {},
			disableInjectedProvider: false,
		});

		const initApp = async () => {
			try {
				const provider = await checkIfUserHasProvider();
				if (provider) {
					connectWallet();
				}
			} catch (err) {
				console.log(err);
			}
		};
		initApp();
	}, []);

	return (
		<div className="bg-black min-h-screen relative">
			<Head>
				<title>Phit NFT Collection Whitelist</title>
				<meta name="description" content="The whitelist application for phit nft collection" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Particle />
			<div className="relative z-10 h-screen flex flex-col items-center justify-center text-center">
				<h1 className="text-[12vw] font-druk leading-[0.8em] text-white">Explore &apos;PHIT NFT&apos; Collection</h1>
				<p className="text-white mb-12 text-base">
					(Join the whitelist to be given priviledge when the presale of these special NFTS begins)
				</p>
				{hasMetamask && (
					<div className="text-base md:text-[1.5vw] text-white mb-8">
						{numberOfWhitelistedUsers} {numberOfWhitelistedUsers === 1 ? "user" : "users"} already joined the whitelist
					</div>
				)}
				<div className="text-base md:text-[1.5vw] text-white">
					<Info
						hasUserJoinedWhitelist={hasUserJoinedWhitelist}
						addAddressToWhitelist={addAddressToWhitelist}
						isCheckingProvider={isCheckingProvider}
						hasMetamask={hasMetamask}
						connectWallet={onConnectWallet}
						isCheckingWhitelist={isCheckingWhitelist}
						connectedWallets={connectedWallets}
					/>
				</div>
				<AlertModal isCheckingProvider={isCheckingProvider} isCheckingWhitelist={isCheckingWhitelist} />

				<p className="text-white text-base absolute bottom-[10px]">
					NOTE: This project is a &quot;modified clone&quot; of &nbsp;
					<a href="https://github.com/LearnWeb3DAO/Whitelist-Dapp" target="_blank" className="underline">
						LearnWeb3 Whitelist Dapp
					</a>
					,&nbsp; as one of the best ways to ensure knowledge sticks is to modify a tutorial. <br /> 5000 thumbs up 👍🏾
					to{" "}
					<a href="https://learnweb3.io/" target="_blank" className="underline">
						LearnWeb3
					</a>{" "}
					for making learning web3 easy
				</p>
			</div>
		</div>
	);
}

// --------------------------------------------------------
// LOADER
// --------------------------------------------------------
function AlertModal({ isCheckingProvider, isCheckingWhitelist }) {
	const show = isCheckingProvider || isCheckingWhitelist;

	if (!show) return null;
	return (
		<>
			{isCheckingProvider && <Loader text="Checking Eth Provider..." />}
			{isCheckingWhitelist && <Loader text="Checking Whitelist..." />}
		</>
	);
}

// --------------------------------------------------------
// DISPAY INFORMATION ABOUT USERS CURRENT STATE
// --------------------------------------------------------
function Info({
	hasUserJoinedWhitelist,
	addAddressToWhitelist,
	isCheckingProvider,
	hasMetamask,
	connectWallet,
	isCheckingWhitelist,
	connectedWallets,
}) {
	if (isCheckingProvider || isCheckingWhitelist) {
		return null;
	}
	if (hasMetamask) {
		if (!hasUserJoinedWhitelist && !isCheckingWhitelist && connectedWallets.length > 0) {
			return (
				<div>
					<Button onClick={addAddressToWhitelist}>Join the Whitelist</Button>
				</div>
			);
		}

		if (hasUserJoinedWhitelist) {
			return <div>Congratulations on joining the whitelist</div>;
		}
	} else {
		return (
			<>
				<p className="mb-8 text-base md:text-[1.5vw] leading-[1.5em]">
					Please app is built just for metamask at the moment and you don&apos;t seem to have metamask.
					<br />
					Please get the extension and try again.
				</p>
				<Button onClick={connectWallet}>Connect</Button>
			</>
		);
	}
}
