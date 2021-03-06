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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import './login.css';

export class LoginComponent extends React.Component {

  render() {
    return (
        <Dialog
          aria-labelledby="form-dialog-title"
          open={this.props.open}
          onClose={this.props.openLogin.bind(this)}
        >
          <DialogContent>
            <DialogTitle id="form-dialog-title">Login to Ldice</DialogTitle>
            <TextField
              className="Login-field"
              autoFocus
              margin="dense"
              id="passphrase"
              label="Passphrase"
              type="text"
              fullWidth
              onChange={this.props.setPassphrase.bind(this)}
              value={this.props.passphrase}
            />
            <DialogActions>
              <Button className="Login-bttn" onClick={this.props.openLogin.bind(this)}>LOGIN</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
    );
  }
}
