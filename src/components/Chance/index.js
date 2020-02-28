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
import BigNum from 'bignumber.js';
import NumberFormat from "react-number-format";
import './chance.css';

import { utils } from "@liskhq/lisk-transactions/dist-node";
import { getPureProfit, CalculateBetProfit, config } from '../../config';

export class Chance extends React.Component {

  highlight = false;
  up = false;
  treasury = this.props.treasury.balance;

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.treasury.balance !== this.props.treasury.balance) {
      setTimeout(() => {
        this.highlight = true;
        this.up = new BigNum(prevProps.treasury.balance).lt(this.props.treasury.balance);
        this.treasury = this.props.treasury.balance;
        setTimeout(() => {
          this.highlight = false;
        }, config.HighlightDelay);
      }, 1000);
    }
  }

  render() {
    return (
      <div className="ldice-container Chance-container">

        <div className="blurb">
          <div className="Blurb-titel">Roll under</div>
          <div className="Blurb-content">{this.props.currentNumber}</div>
        </div>
        <div className="blurb">
          <div className="Blurb-titel">Winning bet pays</div>
          <div className="Blurb-content">
            <NumberFormat
              value={utils.convertBeddowsToLSK(getPureProfit(utils.convertLSKToBeddows(this.props.amount.toString()), this.props.currentNumber - 1))}
              displayType={'text'} thousandSeparator={true} suffix={` ${config.TokenSymbol}`}/>
          </div>
          <div className="Blurb-info"> You will
            win {utils.convertBeddowsToLSK(CalculateBetProfit(utils.convertLSKToBeddows(this.props.amount.toString()), this.props.currentNumber - 1))} {config.GLOBAL_TOKEN}</div>
        </div>
        <div className="blurb">
          <div className="Blurb-titel">Treasury contains</div>
          <div
            className={`Blurb-content ${this.highlight ? (this.up ? 'highlight-green' : 'highlight-red') : ``}`}>
            <NumberFormat value={new BigNum(this.treasury).dividedBy(10 ** 8).toFixed(0)}
                          displayType={'text'} thousandSeparator={true} suffix={` ${config.TokenSymbol}`}/>
          </div>

        </div>
      </div>
    )
  }
}