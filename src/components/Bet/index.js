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
import Odometer from 'react-odometerjs';
import './bet.css';
import './odometer.css';

import { config } from '../../config';
import { SliderComponent } from "./slider";

export class Bet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastRoll: props.lastRoll,
      showResult: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.props.waitForResult) {
      if (this.state.showResult === true) {
        this.setState({showResult: false});
      }
      this.interval = setInterval(() => {
        this.updateRoll();
      }, 1000);
    }
    if (!this.props.waitForResult && this.props.lastRoll !== null && this.state.lastRoll !== this.props.lastRoll) {
      this.setState({lastRoll: this.props.lastRoll})
    }
    if (!this.state.showResult && this.props.lastRoll > 0 && this.props.lastWon && !this.props.waitForResult) {
      setTimeout(() => {
        this.setState({showResult: true});
      }, 2100);
    }
  }

  updateRoll() {
    if (this.state.lastRoll < 50) {
      this.setState({lastRoll: 999, showResult: false});
    } else {
      this.setState({lastRoll: 0, showResult: false});
      this.updateRoll();
    }
  }

  slide(event, number) {
    this.props.updateNumber(number + 1);
  }

  render() {
    return (
      <div className="ldice-container Bet-container" style={{textAlign: 'center'}}>
        <h4>Bet size</h4>
        <div className="Btn-container">
          <button disabled={this.props.waitForResult} className="btn"
                  onClick={this.props.updateAmount.bind(this, config.MinimumAmount)}>min
          </button>
          <button disabled={this.props.waitForResult} className="btn"
                  onClick={this.props.updateAmount.bind(this, 1)}>1
          </button>
          <button disabled={this.props.waitForResult} className="btn"
                  onClick={this.props.updateAmount.bind(this, 5)}>5
          </button>
          <button disabled={this.props.waitForResult} className="btn"
                  onClick={this.props.updateAmount.bind(this, 10)}>10
          </button>
          <button disabled={this.props.waitForResult} className="btn"
                  onClick={this.props.updateAmount.bind(this, 'max')}>max
          </button>
        </div>
        <div style={{textAlign: 'center'}}>
          <input className="Bet-input" type="text" value={this.props.amount}
                 onChange={this.props.updateAmount.bind(this)}/>
        </div>
          <h4>Chance of winning</h4>
        <div className="Slider-container">
        <SliderComponent waitForResult={this.props.waitForResult} change={this.slide.bind(this)} currentNumber={this.props.currentNumber - 1}/>
        </div>
        {this.props.error && <div className="Bet-error">{this.props.error.toString()}</div>}
        <div style={{textAlign: 'center'}}>
          <button
            disabled={!this.props.account.passphrase ? `Please login` : this.props.waitForResult || (!this.state.showResult && !this.props.waitForResult) ? !(!this.props.lastWon && !this.props.waitForResult) : false}
            className="btn"
            onClick={this.props.roll.bind(this)}>{!this.props.account.passphrase ? `Please login` : this.props.waitForResult || (!this.state.showResult && !this.props.waitForResult) ? (!this.props.lastWon && !this.props.waitForResult ? `ROLL 🎲` : `ROLLING 😎`) : `ROLL 🎲`}</button>
        </div>
        <div className="blurb">
          <Odometer value={this.state.lastRoll} duration={2000} format="ddd" animation={this.lastRoll > 0}/>
        </div>
        {!this.props.waitForResult && this.state.showResult && this.props.lastWon &&
        <div className={`Bet-result ${this.props.lastWon.won ? "Bet-won" : "Bet-lose"}`}>
          {this.props.lastWon.won ? "WON 🏆" : "LOST 🤷‍♀️"}
        </div>}
      </div>
    )
  }
}
