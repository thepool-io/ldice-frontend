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
import './about.css';

export class AboutComponent extends React.Component {

  render() {
    return (
      <Dialog
        aria-labelledby="form-dialog-title"
        open={this.props.open}
        onClose={this.props.openAbout.bind(this)}
      >
        <DialogTitle id="form-dialog-title">About Ldice</DialogTitle>

        <DialogContent>
          Ldice is provably fair dice game made with lisk-sdk. At this stage this is proof of concept running on development test network.
          It was built with lisk-sdk 3.0.2. Ldice is not production ready because of lisk-sdk 3.0.2 limits.
          However next version of sdk will solve most if not all problems experienced in current design.
          For more info read <a href="https://medium.com/@thepool.io" target="_blank" rel="noopener noreferrer nofollow" className="Table-link">https://medium.com/@thepool.io</a>
          <DialogActions>
            <Button className="About-bttn" onClick={this.props.openAbout.bind(this)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}
