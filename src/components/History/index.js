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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import WebSocketClient from '../../websocket/webSocketClient';
import './history.css';

import { HistoryTable } from './table.js'
import { AccountComponent } from "./account";
import { subscribeToBets } from '../../websocket/subscribe';
import { requestLastBets, requestAccount } from '../../websocket/request';

export class History extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      allHistory: [],
      userHistory: [],
    };
    this.loadHistory();
    subscribeToBets(WebSocketClient, (error,data) => this.updateBets(error,data));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.address !== prevProps.address) {
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }
      if (this.props.address) {
        setTimeout(() => {
          this.loadHistory();
        }, 100);
      }
      if (!this.props.address && this.state.userHistory.length > 0) {
        this.setState({userHistory: []});
      }
    }
  }

  updateBets(error,data){
    if (data) {
      data.bet_number = data.bet;
      data.rolled_number = data.rolled;
      let userRows = this.state.userHistory;
      let allRows = this.state.allHistory;
      if (data.senderId === this.props.account.address) {
        userRows = [data, ...userRows];
      }
      allRows = [data, ...allRows];
      this.setState({userHistory: userRows, allHistory: allRows});
    }
  }

  convertArray(inputArray,sender){
    let newArray = [];
    for (var i in inputArray) {
      const betId = Object.keys(inputArray[i])[0];
      const object = inputArray[i][betId];
      newArray.push({"id":betId, "sender":sender,"profit":object.profit,"bet_number":object.bet_number,"rolled_number":object.rolled_number});
    }
    return newArray.reverse();
  }

  loadHistory() {
    requestLastBets(WebSocketClient, (error, data) => {
      if (data) {
        if (data.length > 0) {
          this.setState({allHistory: data});
        }
      }
    });
    if (this.props.address) {
      requestAccount(this.props.address, true, WebSocketClient, (error, data) => {
        if (data){
          if (data.transaction_results) {
            if (data.transaction_results.length > 0) {
              this.setState({userHistory: this.convertArray(data.transaction_results,this.props.address)});
            }
          }
        }
      });
    }
  }

  changeTab(event, tab) {
    this.setState({tab: tab});
  }

  render() {
    let tab = this.state.tab;
    if (!this.props.account.passphrase) {
      tab = 0;
    }
    return (
      <div className="ldice-container History-container Full-height">
        <Tabs
          value={tab}
          onChange={this.changeTab.bind(this)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Bets"/>
          {this.props.account.address && <Tab label="Own Bets"/>}
          {this.props.account.address && <Tab label="My Account"/>}
        </Tabs>
        <div>
          <div hidden={tab !== 0}>
            <HistoryTable type='all' rows={this.state.allHistory}/>
          </div>
          <div hidden={tab !== 1}>
            <HistoryTable type='user' rows={this.state.userHistory}/>
          </div>
          <div hidden={tab !== 2}>
            <AccountComponent account={this.props.account} />
          </div>
        </div>
      </div>
    )
  }
}