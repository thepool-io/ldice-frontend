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

import { BaseTransaction } from '@liskhq/lisk-transactions';
import { utils } from "@liskhq/lisk-transactions";
import { getTimestamp, GetNetworkIDHash } from "../config";

export class BetTransaction extends BaseTransaction {
  static get TYPE () {
    return 1001;
  }

  static get FEE () {
    return `${10 ** 7}`;
  };

  assetToBytes() {
    const { data } = this.asset;
    return data ? Buffer.from(data, 'utf8') : Buffer.alloc(0);
  }
}

export const createTransaction = (amount, betNumber, passphrase) => {
  let tx =  new BetTransaction({
    asset: {
      data: betNumber.toString(),
      amount: `${utils.convertLSKToBeddows(amount)}`,
      recipientId: "0L",
    },
    fee: `${utils.convertLSKToBeddows('0.1')}`,
    timestamp: getTimestamp(),
    networkIdentifier: GetNetworkIDHash(),
  });
  tx.sign(passphrase);
  return tx;
};