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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Logo from '../../assets/images/ldicelogo.png';
import './menu.css';

import { LoginComponent } from "./login";
import { AboutComponent } from "./about";
import { StatsComponent } from "./stats";

const useStyles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '10px',
  },
  title: {
    flexGrow: 1,
  },
};

export class MenuComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      about: false,
      stats: false,
    }
  }

  openLogin() {
    this.setState({open: !this.state.open});
  }

  openAbout() {
    this.setState({about: !this.state.about});
  }

  openStats() {
    this.setState({stats: !this.state.stats});
  }

  render() {
    return (
      <div style={useStyles.root}>
        <AppBar position="fixed">
          <Toolbar>

            <div className="Logo">
              <img className="Logo-img" src={Logo} alt="Ldice logo"/>
            </div>
            <div className="smenu">
            <Button onClick={this.openAbout.bind(this)} color="inherit"><span role="img" aria-label="about">📋</span> About</Button>
            <Button onClick={this.openStats.bind(this)} color="inherit"><span role="img" aria-label="settings">⚙️</span> Settings</Button>

            <div className="logoutbtn">{this.props.passphrase ? <Button onClick={this.props.logout.bind(this)} color="inherit"><span role="img" aria-label="logout">📒</span> Logout {this.props.account.address}</Button> : <Button onClick={this.openLogin.bind(this)} color="primary"><span role="img" aria-label="login">📒</span> Login</Button>}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <LoginComponent
          open={this.state.open}
          openLogin={this.openLogin.bind(this)}
          passphrase={this.props.passphrase}
          setPassphrase={this.props.setPassphrase.bind(this)}
        />
        <AboutComponent open={this.state.about} openAbout={this.openAbout.bind(this)} />
        <StatsComponent open={this.state.stats} openStats={this.openStats.bind(this)} />
      </div>
    );
  }
}