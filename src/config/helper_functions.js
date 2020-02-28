/*
MIT License

Copyright (c) 2020 ThePool.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { APIClient } from '@liskhq/lisk-api-client';
import { getNetworkIdentifier } from '@liskhq/lisk-cryptography';
import { NodeHttp, ChainStartDate, GenesisPayloadHash, NetworkID } from "./config";
import BigNum from 'bignumber.js';

export const LiskNode = new APIClient([NodeHttp]);

export const GetNetworkIDHash = () => {
  return getNetworkIdentifier(GenesisPayloadHash,NetworkID);
}

export const getTimestamp = () => {
  const millisSinceEpoc = Date.now() - Date.parse(ChainStartDate);
  const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
  return parseInt(inSeconds);
};

export const calculateMaxBet = (maxPayout, betNumber) => {
  return new BigNum(maxPayout).multipliedBy(betNumber - 1).dividedBy(99).toFixed(0).toString()
};

export const getPureProfit = (BetAmount, NumberOfBet) => {
  return new BigNum(CalculateBetProfit(BetAmount, NumberOfBet)).minus(BetAmount).toString();
};

export const CalculateBetProfit = (BetAmount, NumberOfBet) => {
  let pureProfit = new BigNum(BetAmount)
      .times(new BigNum(100 - NumberOfBet))
      .dividedBy(NumberOfBet)
      .plus(BetAmount)
      .times(990)
      .dividedBy(1000);
  if (pureProfit.toString().includes(".")) {
    pureProfit = new BigNum(pureProfit.toString().split(".")[0]);
  }
  return pureProfit.toString();
};

export const broadcastTransaction = (transaction) => {
  return LiskNode.transactions.broadcast(transaction.toJSON());
};
