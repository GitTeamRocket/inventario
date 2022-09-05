import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import { validateString, setSelectOptions } from '../../Functions/Helpers'
import { getElements, getWarehouses } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  LIST_ARTICLES,
  MODIFY_ARTICLE,
  NO_ITEMS_ERROR,
  NO_ITEM_MESSAGE,
  MANDATORY_MESSAGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  BRANCHES,
  AVAILABILITIES,
  STATES,
  INVALID_STRING_MESSAGE,
} from '../../Functions/Constants'

class ModifyArticle extends Component {
  constructor() {
    super()
    this.myRef = React.createRef()
    this.state = {
      // Request states
      id: 0,
      warehouse_fk: 0,
      available_state: '',
      physical_state: '',
      branch: '',
      obs: '',

      // Auxiliary form states
      alert: '',
      timeout: '',
      classif: '',
      article_type_name: '',
      warehouses: [],
    }
  }

  componentDidMount() {
    getWarehouses(this.setWarehouses)

    let session_obj = sessionStorage.getItem('edit_article')
    let json_obj = JSON.parse(session_obj)

    if (json_obj) {
      this.setState({
        id: json_obj.id,
        classif: json_obj.classif,
        warehouse_fk: json_obj.warehouse_fk,
        article_type_name: json_obj.name,
        available_state: json_obj.available_state,
        physical_state: json_obj.physical_state,
        branch: json_obj.branch,
        obs: json_obj.obs,
      })

      sessionStorage.removeItem('edit_article')

      return this.buildAlert('success', 'Información de artículo recuperada.')
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
      sessionStorage.setItem('temp_article_id', value)
      getElements('', LIST_ARTICLES, this.setArticle)
    }

    return this.setState({ [attribute]: value })
  }

  clearInputs = () => {
    return this.setState({
      // Request states
      id: 0,
      warehouse_fk: 0,
      available_state: '',
      physical_state: '',
      branch: '',
      obs: '',

      // Auxiliary form states
      classif: '',
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

  scroll = () => {
    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  // Functions related to requests
  setWarehouses = (response, body) => {
    if (response == 'success') {
      return this.setState({ warehouses: body })
    }

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert('attention', 'No hay bodegas creadas.')
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  setArticle = (response, body) => {
    if (body == NO_ITEMS_ERROR || body.length == 0) {
      return this.buildAlert(
        'attention',
        NO_ITEM_MESSAGE +
          'No se encontraron artículos con ese ID. Por favor intente de nuevo.'
      )
    }

    if (response == 'success') {
      let temp_id = sessionStorage.getItem('temp_article_id')
      sessionStorage.removeItem('temp_article_id')

      for (let i = 0; i < body.length; i++) {
        let obj = body[i]

        if (obj.id == temp_id) {
          return this.setState({
            id: obj.id,
            classif: obj.Tipo.classif,
            warehouse_fk: obj.warehouse_fk,
            article_type_name: obj.Tipo.article_type_name,
            available_state: obj.available_state,
            physical_state: obj.physical_state,
            branch: obj.branch,
            obs: obj.obs,
          })
        }
      }

      return this.buildAlert(
        'attention',
        'No se encontraron artículos con ese ID. Por favor intente de nuevo.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('users')
      this.buildAlert('success', 'Artículo modificado con éxito.')

      return this.clearInputs()
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  modifyArticle = () => {
    this.close()
    this.scroll()

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
      id: this.state.id,
      available_state: this.state.available_state,
      physical_state: this.state.physical_state,
      branch: this.state.branch,
      obs: this.state.obs,
      warehouse_fk: this.state.warehouse_fk,
    }

    return simpleRequest(MODIFY_ARTICLE, 'PUT', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (this.state.id < 0) {
      return false
    }

    if (this.state.warehouse_fk < 0) {
      return false
    }

    if (!this.state.available_state) {
      return false
    }

    if (!this.state.physical_state) {
      return false
    }

    if (!this.state.branch) {
      return false
    }

    return true
  }

  render() {
    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title' ref={this.myRef}>
          Modificar artículo
        </span>
        <span className='global-comp-description'>
          Diligencie el formulario para editar un artículo. Puede especificar el
          ID o seleccionar la acción de editar en la opción de listar artículos
          del menú lateral.
        </span>
        <div className='global-comp-form-container'>
          <span className='global-comp-sub-title'>ESPECIFIQUE EL ARTÍCULO</span>
          <span className='global-body-text'>
            Si fue redirigido a través de la opción listar artículos, los
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
          <div className='global-form-group'>
            <span className='global-form-label'>
              Clasificación
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='classif'
              type='text'
              className='global-form-input'
              value={this.state.classif}
              disabled={true}
            />
          </div>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Tipo de artículo
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='article_type_name'
              type='text'
              className='global-form-input'
              value={this.state.article_type_name}
              disabled={true}
            />
          </div>
          <span className='global-comp-sub-title'>EDITE EL ARTÍCULO</span>
          <span className='global-body-text'>
            La etiqueta del artículo será recalculada en función de las
            modificaciones que realice. Recuerde que si modifica un artículo
            compuesto, la bodega y la rama de los artículos secundarios también
            se modificarán con los mismos valores.
          </span>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Bodega
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='warehouse_fk'
              className='global-form-input-select'
              value={this.state.warehouse_fk}
              onChange={this.handleChange}
            >
              <option value={0} disabled={true}>
                Seleccione una bodega...
              </option>
              {setSelectOptions(this.state.warehouses)}
            </select>
          </div>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Disponibilidad
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='available_state'
              className='global-form-input-select'
              value={this.state.available_state}
              onChange={this.handleChange}
            >
              <option
                value=''
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione una disponibilidad...
              </option>
              {setSelectOptions(AVAILABILITIES)}
            </select>
          </div>
          <div className='global-form-group'>
            <span className='global-form-label'>
              Estado
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='physical_state'
              className='global-form-input-select'
              value={this.state.physical_state}
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
                value=''
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione una rama...
              </option>
              {setSelectOptions(BRANCHES)}
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
              onClick={this.modifyArticle}
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

export default ModifyArticle
