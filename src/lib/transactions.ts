import { Types } from '@aptos-labs/ts-sdk';
import { aptosClient } from './aptosClient';
import toast from 'react-hot-toast';

export interface TransactionOptions {
  maxGasAmount?: string;
  gasUnitPrice?: string;
  expireTimestamp?: number;
}

export class TransactionService {
  static async submitTransaction(
    // wallet adapters often accept an options arg after the payload (wallet implementations vary), so allow any
    signAndSubmitTransaction: (payload: Types.TransactionPayload, opts?: any) => Promise<{ hash: string }>,
    payload: Types.TransactionPayload,
    options: TransactionOptions = {}
  ): Promise<boolean> {
    const toastId = toast.loading('Processing transaction...');

    try {
  // Submit the transaction. Pass gas options through to the wallet adapter when available.
      const walletOpts: any = {};
      // Provide multiple key formats for compatibility with different wallet adapters
  const optsAny: any = options as any;
  const maxGas = optsAny.maxGasAmount || optsAny.max_gas_amount || optsAny.max_gas || optsAny.maxGas || undefined;
  const gasPrice = optsAny.gasUnitPrice || optsAny.gas_unit_price || optsAny.gasUnitPrice || optsAny.gasPrice || undefined;
      if (maxGas) {
        walletOpts.max_gas_amount = String(maxGas);
        walletOpts.maxGasAmount = String(maxGas);
        walletOpts.maxGas = String(maxGas);
        walletOpts.max_gas = String(maxGas);
        walletOpts.gas_budget = String(maxGas);
      }
      if (gasPrice) {
        walletOpts.gas_unit_price = String(gasPrice);
        walletOpts.gasUnitPrice = String(gasPrice);
        walletOpts.gasPrice = String(gasPrice);
      }

      // Log the options sent to the wallet for debugging simulation errors
      console.debug('TransactionService: submitting payload with walletOpts=', walletOpts, 'payload=', payload);

      // Try submitting the transaction, with automatic retry if the wallet simulation reports
      // MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS by increasing max_gas_amount.
  let attempt = 0;
  const maxAttempts = 5;
      let lastError: any = null;

      let txHash: string | null = null;
      while (attempt < maxAttempts) {
        try {
          const res = await signAndSubmitTransaction(payload, walletOpts);
          txHash = res?.hash;
          // success
          break;
        } catch (err: any) {
          lastError = err;
          console.warn(`TransactionService: submit attempt ${attempt + 1} failed`, err?.message || err);

          const msg = (err && (err.message || JSON.stringify(err))) || '';
          if (msg.includes('MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS') && attempt < maxAttempts - 1) {
            // increase gas and retry
            const current = parseInt(String(walletOpts.max_gas_amount || optsAny.maxGasAmount || optsAny.max_gas || 0), 10) || 0;
            const next = current > 0 ? Math.floor(current * 2) : 5000000;
            walletOpts.max_gas_amount = String(next);
            walletOpts.maxGasAmount = String(next);
            walletOpts.maxGas = String(next);
            walletOpts.max_gas = String(next);
            walletOpts.gas_budget = String(next);
            console.info(`TransactionService: retrying with increased max_gas_amount=${walletOpts.max_gas_amount}`);
            attempt++;
            continue;
          }

          // Not a gas simulation error or no retries left
          throw err;
        }
      }

      // If we reach here and we don't have a txHash, all attempts failed
      if (!txHash) throw lastError;
      
      // Wait for transaction to be confirmed.
      // Some wallets return a hash before the fullnode has indexed it; poll with backoff when transaction_not_found.
      const maxWaitAttempts = 30;
      let waitAttempt = 0;
      let waitResult: any = null;
      let lastWaitError: any = null;

      // Add initial delay before first attempt - transactions may need time to propagate
      if (waitAttempt === 0) {
        await new Promise((res) => setTimeout(res, 1000));
      }

      while (waitAttempt < maxWaitAttempts) {
        try {
          waitResult = await aptosClient.waitForTransaction({ transactionHash: txHash });
          break;
        } catch (err: any) {
          lastWaitError = err;
          
          // Build comprehensive error message string (case-insensitive search)
          const msg = (err && (
            err.message || 
            err.toString() || 
            JSON.stringify(err) ||
            String(err)
          )) || '';
          const msgLower = msg.toLowerCase();
          
          // Check for various forms of "transaction not found" errors:
          // - String messages containing transaction_not_found (case-insensitive)
          // - HTTP 404 status codes (Not Found)
          // - Error messages containing "404" or "Not Found" (case-insensitive)
          // - URL containing "/by_hash" (transaction lookup endpoint)
          const isTransactionNotFound = 
            msgLower.includes('transaction_not_found') || 
            msgLower.includes('transaction not found') ||
            msgLower.includes('not found') ||
            msgLower.includes('404') ||
            msgLower.includes('/transactions/by_hash') ||
            err?.statusCode === 404 ||
            err?.status === 404 ||
            err?.response?.status === 404 ||
            err?.response?.statusCode === 404 ||
            err?.code === 404 ||
            (err?.response?.data && typeof err.response.data === 'string' && err.response.data.toLowerCase().includes('not found'));
          
          // If the node hasn't indexed the transaction yet, wait and retry
          if (isTransactionNotFound) {
            const delay = Math.min(2000 * (waitAttempt + 1), 20000);
            // Only log detailed info for first few attempts to reduce console noise
            if (waitAttempt < 3) {
              console.warn(`TransactionService: transaction not found yet (404), retrying in ${delay}ms (attempt ${waitAttempt + 1}/${maxWaitAttempts})`, { 
                txHash, 
                errorMsg: msg.substring(0, 200),
                statusCode: err?.statusCode || err?.status || err?.response?.status,
              });
            }
            // Update toast to show we're waiting for confirmation
            toast.loading(`Waiting for transaction confirmation... (attempt ${waitAttempt + 1}/${maxWaitAttempts})`, { id: toastId });
            // small sleep
            await new Promise((res) => setTimeout(res, delay));
            waitAttempt++;
            continue;
          }

          // Other errors: break and propagate
          console.error('TransactionService: error while waiting for transaction', {
            error: err,
            message: msg,
            keys: Object.keys(err || {}),
            statusCode: err?.statusCode || err?.status || err?.response?.status,
            txHash,
          });
          throw err;
        }
      }

      if (!waitResult) {
        // All attempts exhausted
        console.error('TransactionService: transaction not found after polling', lastWaitError);
        throw lastWaitError || new Error('Transaction not found after waiting');
      }

      if (waitResult.success) {
        toast.success('Transaction successful!', { id: toastId });
        return true;
      } else {
        throw new Error('Transaction failed: ' + JSON.stringify(waitResult));
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'TTransaction successful!', { id: toastId });
      return false;
    }
  }

  static createTransferPayload(
    recipientAddress: string,
    amount: number,
    coinType: string = "0x1::aptos_coin::AptosCoin"
  ): Types.TransactionPayload {
    return {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: [coinType],
      arguments: [recipientAddress, amount.toString()]
    };
  }

  static async transferTokens(
    signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
    recipientAddress: string,
    amount: number,
    options: TransactionOptions = {}
  ): Promise<boolean> {
    const payload = this.createTransferPayload(recipientAddress, amount);
    return this.submitTransaction(signAndSubmitTransaction, payload, options);
  }
}