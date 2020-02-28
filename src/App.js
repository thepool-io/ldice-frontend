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

import React from 'react';
import Particles from 'react-particles-js';
import ReactNotification from 'react-notifications-component'
import BigNumber from "bignumber.js";
import WebSocketClient from './websocket/webSocketClient';
import './App.css';

import { getAddressFromPassphrase } from '@liskhq/lisk-cryptography';
import { utils } from "@liskhq/lisk-transactions";
import { Bet, Chance, Footer, History } from './components';
import { MenuComponent } from './components/Header/menu';
import { createTransaction } from "./utils/transactions";
import { broadcastTransaction, config, calculateMaxBet } from "./config";
import { dispatchNotification } from "./utils";
import { subscribeToBets, subscribeToConnect, subscribeToDisconnect } from './websocket/subscribe';
import { requestStatus, requestAccount } from './websocket/request';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: {
        address: getAddressFromPassphrase(config.DefaultPassphrase),
        balance: '0',
        passphrase: config.DefaultPassphrase,
      },
      amount: "1",
      number: 51,
      waitForResult: false,
      error: null,
      lastRoll: 100,
      lastTransaction: {},
      treasury: {
        address: config.TreasuryAddress,
        balance: 0,
      },
    };
    this.getInitialTreasuryBalance();
    this.getAccount();
    subscribeToConnect(WebSocketClient,function(){
      dispatchNotification("Websocket is now online",`${config.NodeWebsocket}`,"success");
    });
    subscribeToDisconnect(WebSocketClient,function() {
      dispatchNotification("Websocket is disconnected",`${config.NodeWebsocket}`,"danger");
    });
    subscribeToBets(WebSocketClient, (error,data) => this.updateBets(error,data));
  }

  updateBets(error,data){
    if (data) {
      if (this.state.waitForResult) {
        if (data.senderId === this.state.account.address) {
          this.setState({
            waitForResult: false,
            lastRoll: data.rolled,
            lastWon: { won: data.rolled <= data.bet, rolledNumber: data.rolled }
          });
          if (data.profit.includes('-')) {
            dispatchNotification(`Bet ${data.id.toString()} confirmed`,`Profit: ${utils.convertBeddowsToLSK(data.profit)} ${config.TokenSymbol}\nNew balance: ${parseFloat(utils.convertBeddowsToLSK(data.senderBalanceAfter)).toFixed(2).toString()} ${config.TokenSymbol}`,"default");
          } else {
            dispatchNotification(`Bet ${data.id.toString()} confirmed`,`Profit: ${utils.convertBeddowsToLSK(data.profit)} ${config.TokenSymbol}\nNew balance: ${parseFloat(utils.convertBeddowsToLSK(data.senderBalanceAfter)).toFixed(2).toString()} ${config.TokenSymbol}`,"success");
          }
        }
      }
      this.updateTreasury(data.treasuryBalanceAfter);
    }
  }

  async getAccount(passphrase) {
    let pp = passphrase;
    if (!passphrase && this.state.account.passphrase) {
      pp = this.state.account.passphrase;
    }
    if (pp) {
      if (pp.split(" ").length === 12) {
        const address = getAddressFromPassphrase(pp);
        requestAccount(address, false, WebSocketClient, (error, data) => {
          if (data && data.balance > 0) {
            this.setState({
              account: {
                balance: new BigNumber(data.balance).dividedBy(10 ** 8).toFixed(2),
                address: address,
                passphrase: pp,
              }
            });
          } else {
            this.setState({
              account: {
                balance: '0',
                address: address,
                passphrase: pp,
              }
            });
          }
        });
      } else {
        this.setState({
          account: {
            passphrase: pp,
            balance: '0',
            address: '',
          }
        });
      }
    }
  }

  async getInitialTreasuryBalance() {
    requestStatus(WebSocketClient, (error, data) => {
      if (data) {
        this.updateTreasury(data.treasuryAccountBalance);
      }
    });
  }

  updateTreasury(newBalance){
    if (newBalance) {
        if (newBalance !== "na") {
          this.setState({
            treasury: {
              address: config.TreasuryAddress,
              balance: newBalance,
          }
        });
      }
    }
  }

  updateNumber(number) {
    this.setState({number: number});
    this.updateAmount(this.state.amount);
  }

  updateAmount(event) {
    if (event.target) {
      event = event.target.value;
    }
    if (event === 'max') {
      if (new BigNumber(this.state.account.balance).gt(new BigNumber(this.state.treasury.balance).dividedBy(10 ** 8).toFixed(0))) {
        event = new BigNumber(calculateMaxBet(new BigNumber(this.state.treasury.balance).dividedBy(10 ** 8).dividedBy(100).toFixed(0), this.state.number));
      } else {
        event = this.state.account.balance;
      }
    }
    if (event === "") {
      event = "0";
    }
    if (new BigNumber(event).gt(calculateMaxBet(new BigNumber(this.state.treasury.balance).dividedBy(10 ** 8).dividedBy(100).toFixed(0), this.state.number))) {
      event = calculateMaxBet(new BigNumber(this.state.treasury.balance).dividedBy(10 ** 8).dividedBy(100).toFixed(0), this.state.number);
    }
    if (new BigNumber(event).gt(this.state.account.balance)) {
      event = this.state.account.balance;
    }
    let numbers = event.toString().split(".");
    numbers[0] = numbers[0].replace(/\D/g, '');
    if (numbers[1]) {
      numbers[1] = numbers[1].replace(/\D/g, '');
    }
    if (numbers.length > 2) {
      numbers.splice(-1, 1);
    }
    let amount = numbers.join('.');
    if (amount.length > 1 && amount.substr(0, 1) === "0" && amount.substr(0, 2) !== "0.") {
      amount = amount.substr(1);
    }
    if (amount < config.MinimumAmount) {
      amount = config.MinimumAmount.toString();
    }
    this.setState({amount: amount});
  }

  async roll() {
    try {
      const transaction = createTransaction(this.state.amount, this.state.number, this.state.account.passphrase);
      const result = await broadcastTransaction(transaction);
      if (result.meta && result.meta.status) {
        this.setState({error: null, lastTransaction: transaction, waitForResult: true, lastRoll: null});
      } else if (result.data && result.data.message) {
        this.setState({error: result.data.message});
      }
    } catch (e) {
      this.setState({error: e});
    }
  }

  setPassphrase(event) {
    this.getAccount(event.target.value);
  }

  logout() {
    this.setState({
      account: {
        balance: '0',
        address: '',
        passphrase: '',
      }
    });
  }

  render() {
    return (
      <div>
        <Particles
          params={{
            "particles": {
              "number": {
                "value": 100
              },
              "size": {
                "value": 4
              }
            },
            "interactivity": {
              "events": {
                "onhover": {
                  "enable": true,
                  "mode": "repulse"
                }
              }
            }
          }}
          style={{
            position: 'absolute',
            zIndex: '1'
          }}/>
        <ReactNotification />
        <MenuComponent
          logout={this.logout.bind(this)}
          account={this.state.account}
          setPassphrase={this.setPassphrase.bind(this)}
          passphrase={this.state.account.passphrase}/>

        <div className="App">
          <div className="Outer-container">
            <Chance
              currentNumber={this.state.number}
              amount={this.state.amount}
              treasury={this.state.treasury}
            />
            <div className="Inner-app">
              <Bet
                account={this.state.account}
                waitForResult={this.state.waitForResult}
                lastRoll={this.state.lastRoll}
                lastWon={this.state.lastWon}
                treasury={this.state.treasury}
                roll={this.roll.bind(this)}
                updateAmount={this.updateAmount.bind(this)}
                amount={this.state.amount}
                currentNumber={this.state.number}
                updateNumber={this.updateNumber.bind(this)}
                error={this.state.error}
              />
              <History
                address={this.state.account.address} account={this.state.account}/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}