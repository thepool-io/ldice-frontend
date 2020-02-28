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

const NodeHttp = "http://ldice.thepool.io:4000";
const NodeWebsocket = "http://ldice.thepool.io:5005";
const ExplorerNode = 'http://ldice.thepool.io:6040';
const ChainStartDate = new Date(Date.UTC(2020, 2, 11, 17, 0, 0, 0)).toISOString();
const GenesisPayloadHash = "304b5c4b96ff6ff1230689c25db983a63a077b91cc881d18042d1f333ba65662";
const NetworkID = "ldice";
const TreasuryAddress = "0L";
const TokenSymbol = "LDT";
const HighlightDelay = 1500;
const NotificationsDelay = 3000;
const NotificationsDelayOnScreen = true;
const MinimumAmount = 0.1;

const DefaultPassphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';

export {
  NodeHttp,
  NodeWebsocket,
  ChainStartDate,
  TreasuryAddress,
  TokenSymbol,
  DefaultPassphrase,
  MinimumAmount,
  ExplorerNode,
  HighlightDelay,
  GenesisPayloadHash,
  NetworkID,
  NotificationsDelay,
  NotificationsDelayOnScreen,
}
