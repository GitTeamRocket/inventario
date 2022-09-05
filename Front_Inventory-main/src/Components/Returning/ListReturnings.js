import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import Modal from './Modal'
import { getElements, getFile } from '../../Functions/Get'
import { setSelectOptions, formatDateToLocal } from '../../Functions/Helpers'
import {
  GET_FILE_RETURNING,
  LIST_RETURNINGS,
  ALERT_TIMEOUT,
  NO_ITEMS_ERROR,
  NO_ITEM_MESSAGE,
  ERROR_MESSAGE,
  AUTH_STATES,
} from '../../Functions/Constants'

class ListReturnings extends Component {
  constructor() {
    super()
    this.state = {
      returnings: [],
      filtered_returnings: [],
      auth_state: 'all',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    getElements('returnings', LIST_RETURNINGS, this.setReturnings)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let value = event.target.value
    this.setState({ auth_state: value })

    return this.filterBorrowings(value)
  }

  routeEdit = (event) => {
    let id = event.target.id.split('-')
    sessionStorage.setItem('edit_returning_id', id[1])

    return this.props.changeSelected(15)
  }

  // Functions related to requests
  setReturnings = async (response, body) => {
    if (response == 'success') {
      this.setState({ filtered_returnings: body })
      return this.setState({ returnings: body })
    }

    this.setState({ returnings: [] })

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert('attention', NO_ITEM_MESSAGE)
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  responseHandler = (response, blob) => {
    if (response == 'success') {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      return saveAs(
        blob,
        year + '_' + month + '_' + day + '_' + 'devoluciones.xlsx'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  export = () => {
    return getFile(GET_FILE_RETURNING, this.responseHandler)
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
    let id = event.target.id.split('-')

    if (parseInt(id[1]) < 1) {
      setTimeout(() => this.buildAlert('error', ERROR_MESSAGE), 10)
      return
    }

    return this.props.showModal(
      <Modal
        returning_id={id[1]}
        closeModal={this.closeModal}
        handleAlerts={this.responseHandler}
      />
    )
  }

  closeModal = () => {
    return this.props.closeModal()
  }

  // Auxiliary functions
  filterBorrowings(value) {
    if (value == 'all') {
      return this.setState({ filtered_returnings: this.state.returnings })
    }

    let filtered_array = []
    let array = this.state.returnings

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]
      if (obj.auth_state.toLowerCase() == value.toLowerCase()) {
        filtered_array.push(obj)
      }
    }

    return this.setState({ filtered_returnings: filtered_array })
  }

  setTable() {
    let rows = this.state.filtered_returnings

    if (rows.length < 1) {
      return (
        <span
          className='global-body-text'
          style={{ marginBottom: '0px', marginTop: '20px' }}
        >
          Actualmente no hay constancias con los filtros seleccionados.
        </span>
      )
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]

      table_rows.push(
        <tr key={'tr' + obj.id}>
          <td>{obj.id}</td>
          <td>{obj.evaluador.user_name}</td>
          <td>{formatDateToLocal(obj.createdAt)}</td>
          <td style={{ textTransform: 'capitalize' }}>{obj.auth_state}</td>
          <td>
            <span
              id={'e-' + obj.id}
              className='global-table-link'
              onClick={this.showModal}
              style={{ marginRight: '10px' }}
            >
              Ver más
            </span>
            <span
              id={'e-' + obj.id}
              className='global-table-link'
              onClick={this.routeEdit}
            >
              Editar
            </span>
          </td>
        </tr>
      )
    }

    let table = (
      <table style={{ marginTop: '20px' }}>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Solicitante</th>
            <th>Fecha de solicitud</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
          {table_rows}
        </tbody>
      </table>
    )

    return table
  }

  setExport() {
    let rol = sessionStorage.getItem('user_rol')
    let array = []

    if (rol == 'jefe de rama') {
      return array
    }

    array.push(
      <span className='global-comp-sub-title'>EXPORTAR CONSTANCIA</span>
    )
    array.push(
      <span className='global-body-text'>
        Para exportar toda la información de las constancias de devolución, por
        favor de{' '}
        <span className='global-table-link' onClick={this.export}>
          clic aquí
        </span>
        .
      </span>
    )

    return array
  }

  render() {
    let table = this.setTable()
    let exportComp = this.setExport()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Listar constancias</span>
        <span className='global-comp-description'>
          Aquí podrá listar todas las constancias de devolución. Utilice la
          lista desplegable para filtrar los elementos.
        </span>
        <div className='global-comp-form-container'>
          {exportComp}
          <span className='global-comp-sub-title'>LISTADO DE CONSTANCIAS</span>
          <select
            id='auth_state'
            className='global-special-form-input-select'
            value={this.state.auth_state}
            onChange={this.handleChange}
          >
            <option value='all'>Todos los estados</option>
            {setSelectOptions(AUTH_STATES)}
          </select>
          {table}
        </div>
      </div>
    )
  }
}

export default ListReturnings
