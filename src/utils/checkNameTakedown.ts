import { ethers } from 'ethers';
import fetch from 'node-fetch';

const encodeFunctionCall = (tokenId: string) => {
  const abi = [{ name: 'isNamehashTakendown', type: 'function', inputs: [{ type: 'bytes32' }], outputs: [{ type: 'boolean' }], stateMutability: 'view' }];
  const iface = new ethers.utils.Interface(abi)
  const encoded = iface.encodeFunctionData("isNamehashTakendown", [tokenId])

  return encoded
}

export async function isNameTakenDown(tokenId: string) {
  try {
    const rpcResponse = await fetch(process.env.RPC_PROVIDER || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'eth_call',
        params: [
          {
            to: process.env.NAME_MANAGER_ADDRESS,
            data: encodeFunctionCall(tokenId),
          },
          'latest',
        ],
        id: 1,
        jsonrpc: '2.0',
      }),
    });

    if (!rpcResponse.ok) {
      throw new Error('Failed to fetch data from RPC server');
    }
    const rpcData = await rpcResponse.json();
    const result = parseInt(rpcData.result) !== 0;
    return Boolean(result);
  } catch (error) {
    console.error('Error while checking name:', error);
    throw new Error('Failed to check name');
  }
}

module.exports = { isNameTakenDown };