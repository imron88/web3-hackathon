MetaMask (EVM) integration

This project is primarily an Aptos-based dApp, but we've added a simple EVM wallet connector to allow users to connect an EVM wallet (MetaMask) for browser-based interactions.

How to use MetaMask in this project

1. Install MetaMask in your browser: https://metamask.io/
2. Open the app (npm run dev) and click the "Connect MetaMask" button in the header.
3. Approve the connection in the MetaMask popup. The header will show your short address and network id.
4. To disconnect, click "Disconnect MetaMask" (this only clears the UI state; MetaMask manages actual connections).

Notes

- The app's core on-chain features use Aptos wallets (Petra). MetaMask is provided only as an additional EVM wallet connector for off-chain UX or future EVM integrations.
- If you need to sign EVM transactions, you'll need to wire the `ethers` provider from `EvmWalletConnect` into your transaction logic and implement appropriate services.
- Ethers v6 is used (package version in package.json). If you update TypeScript or ESLint rules, ensure compatibility with `@typescript-eslint` versions.

If you'd like, I can:
- Add a network switcher to prompt users which EVM network to use (Mainnet / Goerli / Local).
- Implement a minimal EVM token transfer UI that uses MetaMask to sign and send a transaction.
