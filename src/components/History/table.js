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
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import NumberFormat from "react-number-format";
import { config } from '../../config';
import { utils } from "@liskhq/lisk-transactions";

const columns = [

  {
    id: 'id',
    label: 'Bet id',
    minWidth: 100,
    align: 'center',
    format: value => (<a className="Table-link" target="_blank" rel="noopener noreferrer nofollow" href={`${config.ExplorerNode}/tx/${value}`}>{value}</a>),
  },
  {
    id: 'profit',
    label: 'Payout',
    minWidth: 30,
    align: 'center',
    format: value => (<NumberFormat value={utils.convertBeddowsToLSK(value).toString()} displayType={'text'} thousandSeparator={true}
                                   suffix={` ${config.TokenSymbol}`}/>),
  },
  {
    id: 'bet_number',
    label: 'Bet',
    minWidth: 30,
    align: 'center',
    format: value => value,
  },
  {
    id: 'rolled_number',
    label: 'Rolled',
    minWidth: 30,
    align: 'center',
    format: value => value,
  },
];

const useStyles = {
  root: {
    width: '100%',
  },
  tableWrapper: {

    overflow: 'auto',
  },
};

export class HistoryTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      page: 0,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(this.props)
  }

  handleChangePage = (event, newPage) => {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage = event => {
    this.setState({page: 0, rowsPerPage: event.target.value});
  };

  render() {
    return (
      <Paper style={useStyles.root}>
        <div style={useStyles.tableWrapper}>
          {this.props.rows.length > 0 && <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{minWidth: column.minWidth}}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`row-${row.id}-${this.props.type}`}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={`${column.id}-${row.id}-${this.props.type}`} align={column.align}>
                          {column.format(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>}
          {this.props.rows.length === 0 && <div style={{
            width: '100%',
            textAlign: 'center'
          }}>{this.props.type === 'user' ? `No bets found.` : <CircularProgress style={{margin: 25}}/>}</div>}
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={this.props.rows.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={this.handleChangePage.bind(this)}
          onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
        />
      </Paper>
    );
  }
}