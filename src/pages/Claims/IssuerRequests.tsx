import React, { useEffect, useState } from 'react';
import { Layout } from '@/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import identityAbi from '@/abis/identityAbi.json';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ClaimRequest {
  _id: string;
  investorWallet: string;
  identityAddress: string;
  tokenAddress: string;
  issuerAddress?: string;
  claimTopic: number;
  status: 'PENDING' | 'KEY_ADDED' | 'SIGNED' | 'ADDED' | 'REJECTED';
  signature?: string;
  claimData?: string;
  uri?: string;
  createdAt?: string;
}

const topicName = (t: number) =>
  ({ 1: 'KYC', 2: 'AML', 3: 'Accredited Investor' })[t] || `Topic ${t}`;

const IssuerRequests: React.FC = () => {
  const { address: issuerAddress } = useAccount();
  const [requests, setRequests] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployOpen, setDeployOpen] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deployPrivateKey, setDeployPrivateKey] = useState('')
  const [deployInstitutionCode, setDeployInstitutionCode] = useState('')
  const [lastDeployedAddress, setLastDeployedAddress] = useState<string | null>(null)
  const [issuerMap, setIssuerMap] = useState<{ wallet: string; contract: string; topics?: number[] }[]>([])

  const fetchRequests = async () => {
    if (!issuerAddress) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/v1/claims/requests?issuerAddress=${issuerAddress}`
      );
      const json = await res.json();
      console.log('json', json);
      if (!json.success)
        throw new Error(json.error || 'Failed to load requests');
      setRequests(json.data || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const loadIssuerMap = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/v1/claims/issuer/list')
        const json = await res.json()
        if (json.success && json.data?.issuers) {
          setIssuerMap(json.data.issuers)
        }
      } catch (e) {
        console.warn('Failed to load issuer map')
      }
    }
    loadIssuerMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuerAddress]);

  const signRequest = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/v1/claims/requests/${id}/sign`,
        { method: 'POST' }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to sign');
      fetchRequests();
    } catch (e) {
      alert((e as any)?.message || 'Failed');
    }
  };

  const addClaim = async (id: string) => {
    try {

        const {
          investorWallet,
          identityAddress,
          tokenAddress,
          issuerAddress,
          claimTopic,
        } = requests.find(r => r._id === id) as ClaimRequest;

        // Resolve ClaimIssuer contract from connected issuer wallet
        const connectedIssuer = issuerAddress || (await (async () => issuerAddress)())
        const mapped = issuerMap.find(i => i.wallet.toLowerCase() === (connectedIssuer || '').toLowerCase())
        const claimIssuerContract = mapped?.contract
        if (!claimIssuerContract) {
          throw new Error('No ClaimIssuer contract found for connected issuer wallet')
        }

        if (
          !investorWallet ||
          !identityAddress ||
          !tokenAddress ||
          !issuerAddress ||
          !claimTopic
        ) {
          throw new Error('Missing required fields');
        }

        const identityRes = await fetch(
          `http://localhost:5001/api/v1/kyc/identity/details/${investorWallet}`
        );
        const identityJson = await identityRes.json();
        const investorIdentityAddress: string | undefined =
          identityJson?.data?.identityAddress;

        if (!investorIdentityAddress) {
          console.log(
            'No OnChainID found. Please create your OnChainID via KYC.'
          );
          return;
        }

        // Pick a trusted issuer for this topic, if available
        const issuer = issuerAddress;

        if (issuer) {
          if (!(window as any).ethereum) {
            throw new Error('Wallet not detected');
          }

          // Check and switch to Sepolia network if needed
          const browserProvider = new ethers.BrowserProvider(
            (window as any).ethereum
          );
          const network = await browserProvider.getNetwork();

          if (network.chainId !== 11155111n) {
            try {
              // Request to switch to Sepolia network
              await (window as any).ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
              });
            } catch (switchError: any) {
              // If the network is not added, add it
              if (switchError.code === 4902) {
                await (window as any).ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0xaa36a7',
                      chainName: 'Sepolia Test Network',
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      rpcUrls: ['https://sepolia.infura.io/v3/'],
                      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                    },
                  ],
                });
              } else {
                throw new Error('Failed to switch to Sepolia network');
              }
            }
          }

          // Investor adds issuer key to their identity (purpose=3 CLAIM, type=1 ECDSA)
          const signer = await browserProvider.getSigner();
          const identity = new ethers.Contract(
            investorIdentityAddress,
            identityAbi as any,
            signer
          );
          const issuerKey = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
              ['address'],
              [issuerAddress]
            )
          );

          try {
            const investorIdentity = investorIdentityAddress;
            const issuer = issuerAddress;

            // Claim Signer purpose (ERC-734 standard)
            const CLAIM_SIGNER_KEY = 3;

            const abi = [
              {
                type: 'function',
                name: 'getKeysByPurpose',
                inputs: [{ name: '_purpose', type: 'uint256' }],
                outputs: [{ name: 'keys', type: 'bytes32[]' }],
                stateMutability: 'view',
              },
            ];

            const identity = new ethers.Contract(
              investorIdentity,
              abi,
              browserProvider
            );


            const keys = await identity.getKeysByPurpose(CLAIM_SIGNER_KEY);
            console.log('Registered claim signer keys:', keys);

            const issuerKey = ethers.keccak256(
              ethers.AbiCoder.defaultAbiCoder().encode(['address'], [issuer])
            );

            const isRegistered = keys.some(
              (k: any) => k.toLowerCase() === issuerKey.toLowerCase()
            );
            console.log('Is issuer registered as claim signer?', isRegistered);
          } catch (e: any) {
            console.log(e?.message || 'Request failed');
          } finally {
            console.log('Submitting claim request');
          }
          if (issuerKey) {
            const isKeyExists = await identity.getKey(issuerKey);
            const purpose = Number(isKeyExists[0]); // or isKeyExists.purpose
            const keyType = Number(isKeyExists[1]); // or isKeyExists.keyType
            const keyValue = isKeyExists[2]; // bytes32 string

            console.log('Purpose:', purpose);
            console.log('Key Type:', keyType);
            console.log('Key Value:', keyValue);

            console.log(
              'Purpose:',
              purpose,
              'Key type:',
              keyType,
              'Key value:',
              keyValue
            );

            if (keyValue !== issuerKey) {
              console.log('adding key for issuer');
              const keyAdded = await identity.addKey(issuerKey, 3, 1);
              await keyAdded.wait();
              console.log('Key added for issuer');
            }
            const issuerOnchainId = await axios.get(`http://localhost:5001/api/v1/kyc/identity/details/${issuerAddress}`);
            console.log('issuerOnchainId', issuerOnchainId);
            const claimForUser = {
              topic: claimTopic,
              scheme: 1,
              issuer: claimIssuerContract,
              identity: investorIdentityAddress,
              signature: '',
              data: ethers.hexlify(
                ethers.toUtf8Bytes('KYC valid for the user')
              ),
              uri: 'https://polymesh.network/',
            };


            try {
              // Domain for EIP-712 signing
              const domain = {
                name: "Claim",
                version: "1",
                chainId: 11155111, // Sepolia chainId as number
                verifyingContract: investorIdentityAddress,
              };
            
              // Types for EIP-712 signing
              const types = {
                Claim: [
                  { name: "identity", type: "address" },
                  { name: "topic", type: "uint256" },
                  { name: "data", type: "bytes" },
                ],
              };
            
              // Value for EIP-712 signing
              const value = {
                identity: claimForUser.identity,
                topic: claimForUser.topic,
                data: claimForUser.data,
              };
            
              // Sign the typed data (EIP-712)
              claimForUser.signature = await signer.signMessage(
                ethers.getBytes(
                    ethers.keccak256(
                        ethers.AbiCoder.defaultAbiCoder().encode(
                            ['address', 'uint256', 'bytes'],
                            [
                                claimForUser.identity,
                                claimForUser.topic,
                                claimForUser.data
                            ]
                        )
                    )
                )
            );
            console.log(
                `[✓ 26] Claim for User & ClaimSignature has been configured`
            );            
              console.log('Signature:', claimForUser.signature);
              console.log(`[✓] Claim for User & ClaimSignature has been configured`);
            } catch (error) {
              console.error('Error signing claim:', error);
              throw error;
            }
            
            try {
              console.log('Adding claim with params:', {
                topic: claimForUser.topic,
                scheme: claimForUser.scheme,
                issuer: claimForUser.issuer,
                signature: claimForUser.signature,
                data: claimForUser.data,
                uri: claimForUser.uri,
              });
            
              // Check if claim already exists
              const claimId = ethers.keccak256(
                ethers.AbiCoder.defaultAbiCoder().encode(
                  ['address', 'uint256', 'uint256'],
                  [claimForUser.issuer, claimForUser.topic, claimForUser.scheme]
                )
              );
            
              const claimExists = await identity.getClaim(claimId);
              console.log('Claim exists:', claimExists);
            
              // Check by some reliable field (like claimExists.uri or claimExists.data) depending on your contract return
              if (claimExists && claimExists.uri && claimExists.uri !== '0x') {
                console.log('Claim already exists, skipping...');
                return;
              }
            
             
            
              // Send transaction with a buffer on gas limit
              const claimTx = await identity.addClaim(
                claimForUser.topic,
                claimForUser.scheme,
                claimForUser.issuer,
                claimForUser.signature,
                claimForUser.data,
                claimForUser.uri,
                { gasLimit: 1000000 } // 20% buffer
              );
            
              console.log('Transaction sent:', claimTx.hash);
              const receipt = await claimTx.wait();
              console.log('Transaction confirmed:', receipt);
            } catch (error: any) {
              console.error('Error adding claim:', error);
              if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                console.error('Gas estimation failed - transaction will likely revert');
              } else if (error.code === 'INSUFFICIENT_FUNDS') {
                console.error('Insufficient funds for gas');
              } else if (error.reason) {
                console.error('Revert reason:', error.reason);
              }
              throw error;
            }
            
            try {
              // Create the claim hash according to ERC-734 standard
              const claimHash = ethers.keccak256(
                ethers.AbiCoder.defaultAbiCoder().encode(
                  ['address', 'uint256', 'bytes'],
                  [claimForUser.identity, claimForUser.topic, claimForUser.data]
                )
              );

              // const claimData = await identity.getClaim(claim);
              // console.log('Claim:', claimData);
              // const [topic, scheme, issuer, signature, data, uri] = claimData;
              // console.log(
              //   'Topic:',
              //   topic,
              //   'Scheme:',
              //   scheme,
              //   'Issuer:',
              //   issuer,
              //   'Signature:',
              //   signature,
              //   'Data:',
              //   data,
              //   'URI:',
              //   uri
              // );
              // const claimId = ethers.keccak256(
              //   ethers.AbiCoder.defaultAbiCoder().encode(
              //     ['address', 'uint256', 'uint256'],
              //     [issuer, topic, scheme]
              //   )
              // );
              // console.log('Claim ID:', claimId);
              // const isClaimExists = await identity.hasClaim(claimId);
              // console.log('Is claim exists:', isClaimExists);
            } catch (e: any) {
              console.log(e?.message || 'Request failed');
            } finally {
              console.log('Submitting claim request');
            }
            // const tx = await identity.addKey(issuerKey, 3, 1);
            // await tx.wait();
          }
        }

        console.log('adding request:');

        // Create claim request for issuer to sign
     
      // if (!json.success) throw new Error(json.error || 'Failed to add claim');
      fetchRequests();
    } catch (e) {
      alert((e as any)?.message || 'Failed');
    }
  };

  const deployClaimIssuer = async () => {
    try {
      if (!deployPrivateKey) {
        toast.error('Private key is required');
        return;
      }
      setDeploying(true)
      const res = await fetch('http://localhost:5001/api/v1/claims/issuer/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey: deployPrivateKey, institutionCode: deployInstitutionCode || undefined })
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to deploy ClaimIssuer')
      setLastDeployedAddress(json.data?.claimIssuerAddress)
      toast.success(`Deployed ClaimIssuer @ ${json.data?.claimIssuerAddress}`)
      setDeployOpen(false)
      setDeployPrivateKey('')
      setDeployInstitutionCode('')
    } catch (e: any) {
      toast.error(e?.message || 'Deployment failed')
    } finally {
      setDeploying(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 pt-[10%]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Issuer Claim Requests</h1>
          <Button variant="outline" onClick={() => setDeployOpen(true)}>Deploy ClaimIssuer</Button>
        </div>
        {lastDeployedAddress && (
          <div className="mb-4 text-xs text-gray-600">Last deployed ClaimIssuer: <span className="font-mono">{lastDeployedAddress}</span></div>
        )}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <Card key={req._id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold">
                        Investor:{' '}
                        <span className="font-mono">{req.investorWallet}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Identity:{' '}
                        <span className="font-mono">{req.identityAddress}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Token:{' '}
                        <span className="font-mono">{req.tokenAddress}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Topic: {topicName(req.claimTopic)} ({req.claimTopic})
                      </div>
                    </div>
                    <Badge
                      variant={
                        req.status === 'ADDED'
                          ? 'default'
                          : req.status === 'SIGNED'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      disabled={
                        req.status !== 'PENDING' && req.status !== 'KEY_ADDED'
                      }
                      onClick={() => signRequest(req._id)}
                    >
                      Sign Claim
                    </Button>
                    <Button
                      variant="outline"
                      // disabled={req.status !== 'SIGNED'}
                      onClick={() => addClaim(req._id)}
                    >
                      Add Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {requests.length === 0 && (
              <div className="text-sm text-gray-600">No requests found.</div>
            )}
          </div>
        )}
      </div>

      <Dialog open={deployOpen} onOpenChange={setDeployOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy ClaimIssuer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Issuer Private Key</Label>
              <Input type="password" value={deployPrivateKey} onChange={(e) => setDeployPrivateKey(e.target.value)} placeholder="0x... (kept local to your browser during this call)" />
            </div>
            <div className="space-y-2">
              <Label>Institution Code (optional)</Label>
              <Input value={deployInstitutionCode} onChange={(e) => setDeployInstitutionCode(e.target.value)} placeholder="e.g., BANK-001" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployOpen(false)} disabled={deploying}>Cancel</Button>
            <Button onClick={deployClaimIssuer} disabled={deploying}>{deploying ? 'Deploying...' : 'Deploy'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default IssuerRequests;
