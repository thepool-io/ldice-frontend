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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import NumberFormat from "react-number-format";
import WebSocketClient from '../../websocket/webSocketClient';
import './stats.css';

import { config } from "../../config";
import { utils } from "@liskhq/lisk-transactions";
import { subscribeToNodeInfo, subscribeToBets } from '../../websocket/subscribe';
import { requestStatus } from '../../websocket/request';

export class StatsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stats: {
        height: 0,
        currentTime: 0,
        lastBlockId: 0,
      },
      treasury: 0,
    };
    subscribeToNodeInfo(WebSocketClient, (error,data) => this.updateNodeInfo(error,data));
    subscribeToBets(WebSocketClient, (error,data) => this.updateBets(error,data));
    this.getStatus();
  }

  updateNodeInfo(error,data){
    this.setState({
      stats: {
        height: data.height,
        currentTime: data.currentNodeTs,
        lastBlockId: data.lastBlockId,
      },
    });
  }

  updateBets(error,data){
    if (data) {
      if (data.treasuryBalanceAfter) {
        if (data.treasuryBalanceAfter !== "na") {
          this.setState({
            treasury: utils.convertBeddowsToLSK(data.treasuryBalanceAfter),
          });
        }
      }
    }
  }

  async getStatus() {
    requestStatus(WebSocketClient, (error, data) => {
      this.setState({
        stats: {
          height: data.height,
          currentTime: data.currentNodeTs,
          lastBlockId: data.lastBlockId,
        },
        treasury: utils.convertBeddowsToLSK(data.treasuryAccountBalance),
      });
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <Dialog
        aria-labelledby="form-dialog-title"
        open={this.props.open}
        onClose={this.props.openStats.bind(this)}
      >
        <DialogTitle id="form-dialog-title" className="blue">Settings</DialogTitle>
        <DialogContent>
          <h3 className="blue">Info</h3>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="Account-label">
              Node height
            </Grid>
            <Grid item xs={12} sm={6}>
              {this.state.stats.height}
            </Grid>
            <Grid item xs={12} sm={6} className="Account-label">
              Current Timestamp
            </Grid>
            <Grid item xs={12} sm={6}>
              {this.state.stats.currentTime}
            </Grid>
            <Grid item xs={12} sm={6} className="Account-label">
              Latest block id
            </Grid>
            <Grid item xs={12} sm={6}>
              {this.state.stats.lastBlockId}
            </Grid>
            <Grid item xs={12} sm={6} className="Account-label">
              Treasury Balance
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberFormat value={this.state.treasury} displayType={'text'} thousandSeparator={true}
                            suffix={` ${config.TokenSymbol}`}/>
            </Grid>
            <Grid item xs={12} sm={6} className="Account-label">
              Explorer
            </Grid>
            <Grid item xs={12} sm={6}>
              <a href={config.ExplorerNode} className="Stats-link" target="_blank" rel="noopener noreferrer nofollow">{config.ExplorerNode}</a>
            </Grid>
          </Grid>

          <DialogActions>
            <Button className="Stats-bttn" onClick={this.props.openStats.bind(this)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}