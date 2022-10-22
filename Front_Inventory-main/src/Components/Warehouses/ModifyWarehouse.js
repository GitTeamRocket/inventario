import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import {
  validateString,
  validateEmail,
  setSelectOptions,
} from '../../Functions/Helpers'
import { getElementById } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  WAREHOUSES_BY_ID,
  MODIFY_WAREHOUSE,
  NO_ITEMS_ERROR,
  MANDATORY_MESSAGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  INVALID_STRING_MESSAGE,
} from '../../Functions/Constants'

class ModifyWarehouse extends Component {
  constructor() {
    super()
    this.state = {
      // Request states
      id: 0,
      warehouse_name: '',
      desc: '',
      address: '',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    let session_id = sessionStorage.getItem('edit_warehouse_id')
    if (session_id && session_id > 0) {
      this.setState({ id: parseInt(session_id) })
      sessionStorage.removeItem('edit_warehouse_id')

      return getElementById(
        WAREHOUSES_BY_ID + '?warehouse_id=' + session_id,
        this.setWarehouseInfo
      )
    }

    return
  }

  
  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    switch (attribute) {
      case 'id':
        if (value > 0) {
          getElementById(WAREHOUSES_BY_ID + '?warehouse_id=' + value, this.setWarehouseInfo)
        }
        break

      case 'warehouse_name':
        value = value.toUpperCase()
        break

      case 'desc':
        value = value.toLowerCase()
        break

      case 'address':
        value = value.toLowerCase()
        break
    }

    return this.setState({ [attribute]: value })
  }

  clearInputs = () => {
    return this.setState({
      id: 0,
      warehouse_name: '',
      desc: '',
      address: '',
    })
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

  // Functions related to requests
  setWarehouseInfo = (response, body) => {
    if (response == 'success') {
      this.setState({
        warehouse_name: body.warehouse_name,
        desc: body.desc,
        address: body.address,
      })

      return this.buildAlert('success', 'Información de bodega recuperada.')
    }

    this.clearInputs()

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No se ha encontrado una bodega con ese ID. Por favor intente con otro.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('warehouseslist')
      this.buildAlert('success', 'Bodega modificada con éxito.')

      return this.clearInputs()
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  ModifyWarehouse = () => {
    this.close()

    // Verify that the required fields are filled
    if (!this.checkMandatoryInputs()) {
      setTimeout(() => this.buildAlert('attention', MANDATORY_MESSAGE), 10)
      return
    }

    // Verify strings
    if (
      !validateString(this.state.warehouse_name) ||
      !validateString(this.state.desc) ||
      !validateString(this.state.address)
    ) {
      setTimeout(() => this.buildAlert('attention', INVALID_STRING_MESSAGE), 10)
      return
    }

    let body = {
      id: this.state.id,
      warehouse_name: this.state.warehouse_name,
      desc: this.state.desc,
      address: this.state.address,
    }

    return simpleRequest(MODIFY_WAREHOUSE, 'PUT', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (this.state.id == 0) {
      return false
    }

    if (!this.state.warehouse_name) {
      return false
    }

    if (!this.state.address) {
      return false
    }

    return true
  }

  render() {
    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Modificar Bodega</span>
        <span className='global-comp-description'>
          Diligencie el formulario para editar una bodega. Puede especificar el
          ID o seleccionar la acción de editar en la opción de listar bodegas
          del menú lateral.
        </span>
        <div className='global-comp-form-container'>
          <span className='global-comp-sub-title'>ESPECIFIQUE LA BODEGA</span>
          <span className='global-body-text'>
            Si fue redirigido a través de la opción listar bodegas, el
            siguiente campo se diligencia de forma automática.
          </span>
          <div className='global-form-group'>
            <span className='global-form-label'>
              ID
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='id'
              type='numeric'
              className='global-form-input'
              value={this.state.id}
              onChange={this.handleChange}
            />
          </div>
          <span className='global-comp-sub-title'>EDITE LA BODEGA</span>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Nombre de referencia
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='warehouse_name'
              type='text'
              className='global-form-input'
              value={this.state.warehouse_name}
              onChange={this.handleChange}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Direccion
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='address'
              type='text'
              className='global-form-input'
              value={this.state.address}
              onChange={this.handleChange}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Descripcion corta
            </span>
            <input
              id='desc'
              type='text'
              className='global-form-input'
              value={this.state.desc}
              onChange={this.handleChange}
            />
          </div>

          {/* <div className='global-form-group'>
            <span className='global-form-label'>
              Correo del responsable
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='phone'
              type='text'
              className='global-form-input'
              value={this.state.phone}
              onChange={this.handleChange}
            />
          </div> */}

          <div className='global-form-buttons-container'>
            <button
              className='global-form-solid-button'
              onClick={this.ModifyWarehouse}
            >
              Enviar
            </button>
            <button
              className='global-form-outline-button'
              onClick={this.clearInputs}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ModifyWarehouse
