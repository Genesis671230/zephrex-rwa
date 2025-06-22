'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { injected } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { useAppKit } from '@reown/appkit/react';
import KYCForm from './KycForm';
import TokenizationForm from '@/components/TokenCard/TokenizationForm';

const api = axios.create({
	baseURL: 'http://localhost:5001/api/v1',
});

export const identityService = {
	async createKYC(walletAddress: string) {
		const response = await api.post('/kyc/create', { walletAddress });
		return response.data;
	},

	async createIdentity(walletAddress: string) {
		const response = await api.post('/identity/create', { walletAddress });
		return response.data;
	},
	async getIdentityDetails(walletAddress: string) {
		const response = await api.get(`/kyc/identity/details/${walletAddress}`);
		return response.data;
	},
	async getIdentityStatus(walletAddress: string) {
		const response = await api.post(`/kyc/identity/status/${walletAddress}`);
		return response.data;
	},
	async getIdentityList(walletAddress: string) {
		const response = await api.get(`/identity/list/${walletAddress}`);
		return response.data;
	},
	async verifyKYC(walletAddress: string) {
		const response = await api.get(`/identity/verify/${walletAddress}`);
		return response.data;
	},


};

export const tokenService = {
	async createToken(tokenDetails: any) {
		const response = await api.post('/token/create', tokenDetails);
		return response.data;
	},

	async getTokens() {
		const response = await api.get('/token/list');
		return response.data;
	},

	async getTokenDetails(tokenAddress: string) {
		const response = await api.get(`/token/${tokenAddress}`);
		return response.data;
	},
};
// src/components/identity/OnchainIDSetup.tsx

export const OnchainIDSetup = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { address, isConnected } = useAppKitAccount();

	const [identityStatus, setIdentityStatus] = useState<string | null>(null);
	const getUserIdentity = async () => {
		if (address) {
			console.log(address,'here is a address')
			const userIdentity = await identityService.getIdentityStatus(address)
			setIdentityStatus(userIdentity.data)
			console.log(userIdentity,'here is a user identity')
		}
	}

	useEffect(() => {
		if(address){
			getUserIdentity()
		}
	}, [address]);
	const handleCreateIdentity = async () => {
		// if (!address) return;

		// setLoading(true);
		// setError(null);

		// try {
		// // await identityService.createIdentity(address);
		// // Handle success
		// } catch (err) {
		// setError(err as string);
		// } finally {
		// setLoading(false);

		// }
	};



	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4">Setup Your OnchainID</h2>

			{!isConnected &&(
				<button
				// onClick={() => connect({connector: injected()})}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Connect Wallet
				</button>
			) }
			{isConnected && !identityStatus?.startsWith('0x0000000') ? (
				<div>
          
					Congratulations! <span className='text-green-500 text-5xl'>🎉</span> You have a valid onChainId : {identityStatus}.
          <TokenizationForm />
				</div>
				) : (
          <div>
				<button
					onClick={handleCreateIdentity}
					disabled={loading}
					className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
				>
					{loading ? 'Processing...' : 'Create Identity'}
				</button>

        <KYCForm />
				</div>
				)}

			{error && (
				<p className="text-red-500 mt-2">{error}</p>
			)}
		</div>
	);
};


export const TokenCreation = () => {
	const [formData, setFormData] = useState({
		name: '',
		symbol: '',
		decimals: 18,
		salt: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// if (!address) return;

		// setLoading(true);
		// setError(null);

		try {
		// await tokenService.createToken({
		// ...formData,
		// ownerWalletAddress: address,
		// });
			// Handle success
		} catch (err: any) {
		// setError(err.message);
		// } finally {
		// setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">Token Name</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					required
				/>
			</div>

			{/* Other form fields */}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
			>
				{loading ? 'Creating Token...' : 'Create Token'}
			</button>

			{error && (
				<p className="text-red-500">{error}</p>
			)}
		</form>
	);
};


const IssuerDashboard = () => {
	const { address, isConnected } = useAppKitAccount();
	const { open } = useAppKit();


	if (!isConnected) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h1>
				<Button onClick={() => open()}>Connect Wallet</Button>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

			{/* {!identityStatus && ( */}
				<div className="mb-8">
					<OnchainIDSetup />
				</div>
			{/* )} */}

			{/* {identityStatus === 'VERIFIED' && ( */}
				{/* <div className="mb-8">
					<h2 className="text-xl font-semibold mb-4">Create New Token</h2>
					<TokenCreation />
				</div> */}
			{/* )} */}

			{/* Other dashboard components */}
		</div>
	);
}

export default IssuerDashboard;
