import React, { Component } from 'react'
import { Table, TableHead, TableCell, TableBody, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input } from '@material-ui/core'
import { MdDelete } from 'react-icons/md'

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
      newTransactionDialogOpen: false,
      deleteTransactionDialogOpen: false,
      newTransaction: {
          description: '',
          value: '',
          date: new Date()
      },
      selectedTransaction: {}
  }
  
  handleOpenNewTransactionDialog = () => {
    this.setState({
      newTransactionDialogOpen: true
    })
  }

  handleOpenDeleteTransactionDialog = (transaction) => {
      let selectedTransaction = transaction
      this.setState({
        deleteTransactionDialogOpen: true,
        selectedTransaction: selectedTransaction
      })
  }

  handleCancelCreate = () => {
    const emptyTransaction = this.state.newTransaction
    emptyTransaction.description = ''
    emptyTransaction.value = 0
    emptyTransaction.date = new Date()
    this.setState({
      newTransaction: emptyTransaction,
      newTransactionDialogOpen: false
    })
  }

  handleCancelDelete = () => {
      this.setState({
          deleteTransactionDialogOpen: false,
          selectedTransaction: {}
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
    this.handleCancelCreate()
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

  handleDelete = async (transactionId) => {
    const deleteResponse = await api.delete(`/transactions/${transactionId}`)
    let updatedTransactions = this.state.transactions
    if (deleteResponse.data.n === 1) {
        updatedTransactions = updatedTransactions.filter(element => {
            return element._id !== transactionId
        })
        this.setState({
            transactions: updatedTransactions
        })
    } else {
        console.error('Algum erro aconteceu durante a deleção')
    }
    this.handleCancelDelete()
  }

  render() {
    return (
        <div>
            <Button variant="contained" onClick={this.handleOpenNewTransactionDialog} color="primary">
                Adicionar Transação
            </Button>

            <Dialog open={this.state.newTransactionDialogOpen}
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
                  <Button onClick={this.handleCancelCreate}>
                    Cancelar
                  </Button>
                  <Button style={style.successButton} onClick={this.handleSave}>
                    Salvar
                  </Button>
                </DialogActions>
            </Dialog>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor (R$)</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { this.state.transactions && this.state.transactions.map(transaction => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction._id}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell style={transaction.value > 0 ? style.positiveTransaction : style.negativeTransaction}>{transaction.value}</TableCell>
                    <TableCell>{ new Date(transaction.date).toLocaleDateString('pt-BR') }</TableCell>
                    <TableCell>
                      <MdDelete
                          size={18}
                          style={style.deleteIcon}
                          onClick={this.handleOpenDeleteTransactionDialog.bind(this, transaction)} />
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>

            <Dialog open={this.state.deleteTransactionDialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Deletar Transação</DialogTitle>
                <DialogContent>
                  Tem certeza que deseja deletar a seguinte transação? <br /><br />
                  <strong>Descrição:</strong> { this.state.selectedTransaction.description } <br />
                  <strong>Valor:</strong> R$ { this.state.selectedTransaction.value } <br />
                  <strong>Data:</strong> { new Date(this.state.selectedTransaction.date).toLocaleDateString('pt-BR') }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancelDelete}>Cancelar</Button>
                    <Button style={style.deleteButton} onClick={this.handleDelete.bind(this, this.state.selectedTransaction._id)}>Deletar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
  }
}

const style = {
    deleteIcon: {
        color: '#C82433',
        cursor: 'pointer'
    },
    positiveTransaction: {
        color: '#218839'
    },
    negativeTransaction: {
        color: '#C82433'
    },
    successButton: {
      backgroundColor: '#218839',
      color: '#fff'
    },
    deleteButton: {
      backgroundColor: '#C82433',
      color: '#fff'
    }
}