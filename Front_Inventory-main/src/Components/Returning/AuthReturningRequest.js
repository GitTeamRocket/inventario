import React, { Component } from 'react'

import Alert from '../Alerts/Alert'
import AuthModal from './AuthModal'
import { formatDateToLocal } from '../../Functions/Helpers'
import { getElements } from '../../Functions/Get'
import {
  LIST_RETURNINGS,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  NO_ITEMS_ERROR,
} from '../../Functions/Constants'

class AuthReturningRequest extends Component {
  constructor() {
    super()
    this.state = {
      alert: '',
      timeout: '',
      returning_requests: [],
    }
  }

  componentDidMount() {
    sessionStorage.removeItem('returnings')
    getElements('returnings', LIST_RETURNINGS, this.setReturnings)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions related to requests
  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('returnings')

      getElements('returnings', LIST_RETURNINGS, this.setReturnings)

      return this.buildAlert(
        'success',
        'La solicitud ha sido procesada exitosamente.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  setReturnings = (response, body) => {
    if (response == 'success') {
      return this.setState({ returning_requests: body })
    }

    if (body == NO_ITEMS_ERROR) {
      return this.setState({ borrowing_requests: [] })
    }

    return this.buildAlert('error', ERROR_MESSAGE)
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

  // Functions to handle alerts
  close = () => {
    return this.setState({ alert: '' })
  }

  // Functions to handle modal
  showModal = (event) => {
    let id = event.target.id

    if (parseInt(id) < 1) {
      setTimeout(() => this.buildAlert('error', ERROR_MESSAGE), 10)
      return
    }

    return this.props.showModal(
      <AuthModal
        returning_id={id}
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
    let rows = this.state.returning_requests
    let no_items = (
      <span className='global-body-text' style={{ marginBottom: '0px' }}>
        Actualmente no hay solicitudes de devolución para autorizar.
      </span>
    )

    if (rows.length < 1) {
      return no_items
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]

      if (obj.auth_state != 'Pendiente') {
        continue
      }

      table_rows.push(
        <tr key={'tr-' + obj.id}>
          <td>{obj.id}</td>
          <td>{obj.evaluador.user_name}</td>
          <td>{formatDateToLocal(obj.createdAt)}</td>
          <td>{obj.auth_state}</td>
          <td>
            <span
              id={obj.id}
              className='global-table-link'
              onClick={this.showModal}
            >
              Autorizar
            </span>
          </td>
        </tr>
      )
    }

    if (table_rows.length < 1) {
      return no_items
    }

    let table = (
      <table>
        <tbody>
          <tr>
            <th>ID Constancia</th>
            <th>Responsable temporal</th>
            <th>Fecha de creación</th>
            <th>Estado de constancia</th>
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
          Autorizar solicitudes de devoluciones
        </span>
        <span className='global-comp-description'>
          Seleccione una constancia de devolución para autorizarla.
        </span>
        <div className='global-comp-form-container'>{table}</div>
      </div>
    )
  }
}

export default AuthReturningRequest
