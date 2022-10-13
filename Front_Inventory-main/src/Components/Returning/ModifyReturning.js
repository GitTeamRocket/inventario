import React, { Component } from 'react'

import Alert from '../Alerts/Alert'
import { validateString, setSelectOptions } from '../../Functions/Helpers'
import { getElementById } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  MANDATORY_MESSAGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  AUTH_STATES,
  INVALID_STRING_MESSAGE,
  NO_ITEMS_ERROR,
  STATES,
  MODIFY_RETURNING,
  RETURNING_BY_ID,
} from '../../Functions/Constants'

class ModifyReturning extends Component {
  constructor() {
    super()
    this.state = {
      // Request states
      id: 0,
      state: '',
      auth_state: '',
      obs: '',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    let session_id = sessionStorage.getItem('edit_returning_id')
    if (session_id && session_id > 0) {
      this.setState({ id: parseInt(session_id) })
      sessionStorage.removeItem('edit_returning_id')

      return getElementById(
        RETURNING_BY_ID + '?returning_id=' + session_id,
        this.setReturningInfo
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

    if (attribute == 'id' && value > 0) {
      getElementById(
        RETURNING_BY_ID + '?returning_id=' + value,
        this.setReturningInfo
      )
    }

    return this.setState({ [attribute]: value })
  }

  setReturningInfo = (response, body) => {
    if (response == 'success') {
      this.setState({
        id: body.id,
        state: body.state,
        auth_state: body.auth_state,
        obs: body.obs,
      })

      return this.buildAlert(
        'success',
        'Información de la constancia recuperada.'
      )
    }

    this.clearInputs()

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No se ha encontrado una constancia con ese ID. Por favor intente con otro.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  clearInputs = () => {
    return this.setState({
      // Request states
      id: 0,
      state: '',
      auth_state: '',
      obs: '',
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

  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('returnings')
      this.buildAlert('success', 'Constancia modificado con éxito.')

      return this.clearInputs()
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  modifyReturning = () => {
    this.close()

    // Verify that the required fields are filled
    if (!this.checkMandatoryInputs()) {
      setTimeout(() => this.buildAlert('attention', MANDATORY_MESSAGE), 10)
      return
    }

    // Verify that obs are valid
    if (!validateString(this.state.obs)) {
      setTimeout(() => this.buildAlert('attention', INVALID_STRING_MESSAGE), 10)
      return
    }

    let body = {
      returning_id: this.state.id,
      auth_state: this.state.auth_state,
      state: this.state.state,
      obs: this.state.obs,
    }

    return simpleRequest(MODIFY_RETURNING, 'PUT', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (!this.state.id) {
      return false
    }

    if (!this.state.state) {
      return false
    }

    if (!this.state.auth_state) {
      return false
    }

    return true
  }

  render() {
    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Modificar constancia</span>
        <span className='global-comp-description'>
          Diligencie el formulario para editar una constancia. Puede especificar
          el ID o seleccionar la acción de editar en la opción de listar
          constancias.
        </span>
        <div className='global-comp-form-container'>
          <span className='global-comp-sub-title'>
            ESPECIFIQUE LA CONSTANCIA
          </span>
          <span className='global-body-text'>
            Si fue redirigido a través de la opción listar constancias, los
            siguientes campos se diligencian de forma automática.
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
          <span className='global-comp-sub-title'>EDITE LA CONSTANCIA</span>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Estado artículos
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='state'
              className='global-form-input-select'
              value={this.state.state}
              onChange={this.handleChange}
            >
              <option
                value=''
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione un estado...
              </option>
              {setSelectOptions(STATES)}
            </select>
          </div>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Estado constancia
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='auth_state'
              className='global-form-input-select'
              value={this.state.auth_state}
              onChange={this.handleChange}
            >
              <option
                value=''
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione un estado...
              </option>
              {setSelectOptions(AUTH_STATES)}
            </select>
          </div>
          <div className='global-form-group'>
            <span className='global-form-label'>Observaciones</span>
            <input
              id='obs'
              type='text'
              className='global-form-input'
              value={this.state.obs}
              onChange={this.handleChange}
            />
          </div>
          <div className='global-form-buttons-container'>
            <button
              className='global-form-solid-button'
              onClick={this.modifyReturning}
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

export default ModifyReturning
