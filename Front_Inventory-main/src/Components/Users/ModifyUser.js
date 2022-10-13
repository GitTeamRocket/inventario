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
  USERS_BY_ID,
  MODIFY_USER,
  NO_ITEMS_ERROR,
  MANDATORY_MESSAGE,
  EMAIL_MESSAGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  BRANCHES,
  ROL_TYPES,
  INVALID_STRING_MESSAGE,
} from '../../Functions/Constants'

class ModifyUser extends Component {
  constructor() {
    super()
    this.state = {
      // Request states
      id: 0,
      email: '',
      user_name: '',
      branch: '',
      rol: '',
      phone: '',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    let session_id = sessionStorage.getItem('edit_user_id')
    if (session_id && session_id > 0) {
      this.setState({ id: parseInt(session_id) })
      sessionStorage.removeItem('edit_user_id')

      return getElementById(
        USERS_BY_ID + '?user_id=' + session_id,
        this.setUserInfo
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
          getElementById(USERS_BY_ID + '?user_id=' + value, this.setUserInfo)
        }
        break

      case 'phone':
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
        break

      case 'email':
        value = value.toLowerCase()
        break

      case 'user_name':
        value = value.toUpperCase()
        break
    }

    return this.setState({ [attribute]: value })
  }

  clearInputs = () => {
    return this.setState({
      id: 0,
      email: '',
      user_name: '',
      branch: '',
      rol: '',
      phone: '',
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
  setUserInfo = (response, body) => {
    if (response == 'success') {
      this.setState({
        user_name: body.user_name,
        email: body.email,
        branch: body.branch,
        phone: body.phone,
        rol: body.rol,
      })

      return this.buildAlert('success', 'Información de usuario recuperada.')
    }

    this.clearInputs()

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No se ha encontrado un usuario con ese ID. Por favor intente con otro.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('users')
      this.buildAlert('success', 'Usuario modificado con éxito.')

      return this.clearInputs()
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  modifyUser = () => {
    this.close()

    // Verify that the required fields are filled
    if (!this.checkMandatoryInputs()) {
      setTimeout(() => this.buildAlert('attention', MANDATORY_MESSAGE), 10)
      return
    }

    // Verify that the email format is valid
    if (!validateEmail(this.state.email)) {
      setTimeout(() => this.buildAlert('attention', EMAIL_MESSAGE), 10)
      return
    }

    // Verify strings
    if (
      !validateString(this.state.email) ||
      !validateString(this.state.user_name) ||
      !validateString(this.state.phone)
    ) {
      setTimeout(() => this.buildAlert('attention', INVALID_STRING_MESSAGE), 10)
      return
    }

    let body = {
      id: this.state.id,
      email: this.state.email,
      user_name: this.state.user_name,
      branch: this.state.branch,
      rol: this.state.rol,
      phone: this.state.phone,
    }

    return simpleRequest(MODIFY_USER, 'PUT', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (this.state.id == 0) {
      return false
    }

    if (!this.state.email) {
      return false
    }

    if (!this.state.user_name) {
      return false
    }

    if (!this.state.branch) {
      return false
    }

    if (!this.state.rol) {
      return false
    }

    if (!this.state.phone) {
      return false
    }

    return true
  }

  render() {
    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Modificar usuario</span>
        <span className='global-comp-description'>
          Diligencie el formulario para editar un usuario. Puede especificar el
          ID o seleccionar la acción de editar en la opción de listar usuarios
          del menú lateral.
        </span>
        <div className='global-comp-form-container'>
          <span className='global-comp-sub-title'>ESPECIFIQUE EL USUARIO</span>
          <span className='global-body-text'>
            Si fue redirigido a través de la opción listar usuarios, el
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
          <span className='global-comp-sub-title'>EDITE EL USUARIO</span>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Nombre completo
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='user_name'
              type='text'
              className='global-form-input'
              value={this.state.user_name}
              onChange={this.handleChange}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Correo electrónico
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='email'
              type='email'
              className='global-form-input'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Teléfono
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='phone'
              type='text'
              className='global-form-input'
              value={this.state.phone}
              onChange={this.handleChange}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Rama
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='branch'
              className='global-form-input-select'
              value={this.state.branch}
              onChange={this.handleChange}
            >
              <option
                className='global-form-input-select-option'
                value=''
                disabled={true}
              >
                Seleccione una rama...
              </option>
              {setSelectOptions(BRANCHES)}
            </select>
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Rol
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='rol'
              className='global-form-input-select'
              value={this.state.rol}
              onChange={this.handleChange}
            >
              <option
                className='global-form-input-select-option'
                value=''
                disabled={true}
              >
                Seleccione un rol...
              </option>
              {setSelectOptions(ROL_TYPES)}
            </select>
          </div>
          <div className='global-form-buttons-container'>
            <button
              className='global-form-solid-button'
              onClick={this.modifyUser}
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

export default ModifyUser
