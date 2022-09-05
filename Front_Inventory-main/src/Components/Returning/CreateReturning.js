import React, { Component } from 'react'

import Alert from '../Alerts/Alert'
import CreationModal from './CreationModal'
import { formatDateToLocal } from '../../Functions/Helpers'
import { getFilteredBorrowings } from '../../Functions/Get'
import {
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  NO_ITEMS_ERROR,
} from '../../Functions/Constants'

class CreateReturning extends Component {
  constructor() {
    super()
    this.state = {
      alert: '',
      timeout: '',
      borrowing_requests: [],
    }
  }

  componentDidMount() {
    getFilteredBorrowings(this.setBorrowings)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions related to requests
  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('borrowings')
      sessionStorage.removeItem('filtered_borrowings')
      getFilteredBorrowings(this.setBorrowings)

      return this.buildAlert(
        'success',
        'Constancia de devolución creada con éxito.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  setBorrowings = (response, body) => {
    if (response == 'success') {
      return this.setState({ borrowing_requests: body })
    }

    if (body == NO_ITEMS_ERROR) {
      return this.setState({ borrowing_requests: [] })
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  // Functions to handle alerts
  close = () => {
    return this.setState({ alert: '' })
  }

  buildAlert = (type, text) => {
    clearTimeout(this.state.timeout)

    this.setState({
      timeout: setTimeout(() => this.setState({ alert: '' }), ALERT_TIMEOUT),
    })

    return this.setState({
      alert: <Alert type={type} text={text} close={this.close} />,
    })
  }

  // Functions to handle modal
  showModal = (event) => {
    let id = event.target.id

    if (parseInt(id) < 1) {
      setTimeout(() => this.buildAlert('attention', ERROR_MESSAGE), 10)
      return
    }

    return this.props.showModal(
      <CreationModal
        borrowing_id={id}
        closeModal={this.closeModal}
        handleAlerts={this.responseHandler}
      />
    )
  }

  closeModal = () => {
    return this.props.closeModal()
  }

  // Auxiliary functions
  setTable() {
    let rows = this.state.borrowing_requests

    if (rows.length < 1) {
      return (
        <span className='global-body-text' style={{ marginBottom: '0px' }}>
          Actualmente no hay solicitudes de préstamos autorizadas para generar
          su constancia de devolución.
        </span>
      )
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]
      let date = formatDateToLocal(obj.return_date)

      table_rows.push(
        <tr key={'tr-' + obj.id}>
          <td>{obj.id}</td>
          <td>{obj.Asociado.user_name}</td>
          <td>{date}</td>
          <td>{obj.delay}</td>
          <td>{obj.auth_state}</td>
          <td>
            <span
              id={obj.id}
              className='global-table-link'
              onClick={this.showModal}
            >
              Crear constancia
            </span>
          </td>
        </tr>
      )
    }

    let table = (
      <table>
        <tbody>
          <tr>
            <th>ID Préstamo</th>
            <th>Solicitante</th>
            <th>Fecha acordada de retorno</th>
            <th>Retraso en la entrega</th>
            <th>Estado préstamo</th>
            <th>Acciones</th>
          </tr>
          {table_rows}
        </tbody>
      </table>
    )

    return table
  }

  render() {
    let table = this.setTable()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>
          Crear constancia de devolución
        </span>
        <span className='global-comp-description'>
          Seleccione una solicitud de préstamo aprobada para crear la constancia
          de devolución.
        </span>
        <div className='global-comp-form-container'>{table}</div>
      </div>
    )
  }
}

export default CreateReturning
