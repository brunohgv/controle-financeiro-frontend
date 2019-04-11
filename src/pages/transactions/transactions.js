import React, { Component } from 'react'
import { Table, TableHead, TableCell, TableBody, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input } from '@material-ui/core'
import api from '../../services/api';

export default class Transactions extends Component {
  async componentDidMount() {
      const response = await api.get('transactions')
      this.setState({
          transactions: response.data
      })
  }

  state = {
      transactions: [],
      dialogOpen: false,
      newTransaction: {
          description: '',
          value: '',
          date: new Date()
      }
  }
  
  handleButtonClick = () => {
    this.setState({
        dialogOpen: true
    })
  }

  handleCancel = () => {
    const emptyTransaction = this.state.newTransaction
    emptyTransaction.description = ''
    emptyTransaction.value = 0
    emptyTransaction.date = new Date()
    this.setState({
      newTransaction: emptyTransaction,
      dialogOpen: false
    })
  }

  handleSave = async () => {
    const transaction = await api.post('/transactions', {
        description: this.state.newTransaction.description,
        value: this.state.newTransaction.value,
        date: new Date()
    })
    const updatedList = this.state.transactions
    updatedList.push(transaction.data)
    this.setState({
      transactions: updatedList
    })
    this.handleCancel()
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const changedTransaction = this.state.newTransaction
    changedTransaction[name] = target.value
    this.setState({
      newTransaction: changedTransaction
    })
  }

  render() {
    return (
        <div>
            <Button variant="contained" onClick={this.handleButtonClick} color="primary">
                Adicionar Transação
            </Button>

            <Dialog open={this.state.dialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Adicionar Transação</DialogTitle>
                <DialogContent id="alert-dialog-description">
                    <div>
                        <Input name="description" placeholder="Descrição" value={this.state.newTransaction.description} onChange={evt => this.handleChange(evt)}></Input>
                    </div>
                    <div>
                        <Input name="value" placeholder="Valor" type="number" value={this.state.newTransaction.value} onChange={evt => this.handleChange(evt)}></Input>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel}>
                    Cancelar
                    </Button>
                    <Button onClick={this.handleSave}>
                    Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Data</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.state.transactions && this.state.transactions.map(transaction => (
                        <TableRow key={transaction._id}>
                            <TableCell>{transaction._id}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.value}</TableCell>
                            <TableCell>{ transaction.date }</TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </div>
    )
  }
}
