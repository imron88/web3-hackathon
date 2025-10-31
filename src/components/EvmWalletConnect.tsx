import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Wallet } from 'lucide-react';

export const EvmWalletConnect: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);

      // detect accounts if already connected
      p.send('eth_accounts', [])
        .then((accounts: string[]) => {
          if (accounts && accounts.length) setAccount(ethers.getAddress(accounts[0]));
        })
        .catch(() => {});

      // get chain id
  p.getNetwork().then((n: any) => setChainId(n.chainId as bigint)).catch(() => {});

      // listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length) setAccount(ethers.getAddress(accounts[0]));
        else setAccount(null);
      };

      const handleChainChanged = (chain: string) => {
        try {
          // MetaMask returns hex string like '0x1'
          const parsed = BigInt(chain);
          setChainId(parsed);
        } catch {
          setChainId(null);
        }
      };

      (window as any).ethereum.on?.('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        (window as any).ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectMetaMask = async () => {
    if (!provider) {
      window.open('https://metamask.io/', '_blank');
      return;
    }

    try {
      const accounts = await (provider as ethers.BrowserProvider).send('eth_requestAccounts', []);
      if (accounts && accounts.length) setAccount(ethers.getAddress(accounts[0]));
      const net = await provider.getNetwork();
      setChainId(net.chainId as bigint);
    } catch (err) {
      console.error('MetaMask connect error', err);
    }
  };

  const disconnect = () => {
    // MetaMask does not support programmatic disconnect; we simply clear UI state
    setAccount(null);
  };

  return (
    <div className="flex items-center space-x-4">
      {account && (
        <div className="flex items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
          <Wallet className="h-4 w-4 mr-2" />
          <span className="text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
          {chainId !== null && <span className="ml-2 text-xs text-yellow-700">(net {String(chainId)})</span>}
        </div>
      )}
      <button
        onClick={() => (account ? disconnect() : connectMetaMask())}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
          account ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100' : 'bg-yellow-600 text-white hover:bg-yellow-700'
        }`}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {account ? 'Disconnect MetaMask' : 'Connect MetaMask'}
      </button>
    </div>
  );
};
