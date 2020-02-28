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
import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import WebSocketClient from '../../websocket/webSocketClient';
import './account.css';

import { config } from "../../config";
import { utils } from "@liskhq/lisk-transactions";
import { requestAccount } from '../../websocket/request';

export class AccountComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      won: 0,
      lost: 0,
      profit: "0",
    };
    this.getStatus();
  }

  async getStatus() {
    if (this.props.account.address) {
      requestAccount(this.props.account.address, false, WebSocketClient, (error, data) => {
        if (data.stats) {
          if (data.stats.total && data.stats.lost && data.stats.profit && data.stats.won) {
            this.setState({total: data.stats.total, won: data.stats.won, lost: data.stats.lost, profit: parseFloat(utils.convertBeddowsToLSK(data.stats.profit)).toFixed(2).toString()});
          }
        }
      });
    }
  }

  render() {
    return (
      <div className="ldice-container Account-stats-container Full-height">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className="Account-label">
            Account Balance
          </Grid>
          <Grid item xs={12} sm={6}>
            <NumberFormat value={this.props.account.balance} displayType={'text'} thousandSeparator={true}
                          suffix={` ${config.TokenSymbol}`}/>
          </Grid>
          <Grid item xs={12} sm={6} className="Account-label">
            Account Address
          </Grid>
          <Grid item xs={12} sm={6}>
            <a href={`${config.ExplorerNode}/address/${this.props.account.address}`} target="_blank" rel="noopener noreferrer nofollow"
               className="Table-link">{this.props.account.address}</a>
          </Grid>
          <Grid item xs={12} sm={6} className="Account-label">
            Total Bets
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.state.total}
          </Grid>
          <Grid item xs={12} sm={6} className="Account-label">
            Total Won
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.state.won}
          </Grid>
          <Grid item xs={12} sm={6} className="Account-label">
            Total Lost
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.state.lost}
          </Grid>
          <Grid item xs={12} sm={6} className="Account-label">
            Total Profit
          </Grid>
          <Grid item xs={12} sm={6}>
            <NumberFormat value={this.state.profit} displayType={'text'} thousandSeparator={true}
                          suffix={` ${config.TokenSymbol}`}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}