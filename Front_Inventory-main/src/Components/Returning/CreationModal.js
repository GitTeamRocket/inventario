import React, { Component } from 'react'

import { setSelectOptions, validateString } from '../../Functions/Helpers'
import { getElementById } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  BORROWING_BY_ID,
  CREATE_RETURNING,
  STATES,
  INVALID_STRING_MESSAGE,
} from '../../Functions/Constants'

class CreationModal extends Component {
  constructor() {
    super()
    this.state = {
      // Information states
      user_name: '',
      warehouse_name: '',
      article_list: [],

      // Form states
      physical_state: 'Funcional',
      obs: '',
    }
  }

  componentDidMount() {
    let path = BORROWING_BY_ID + '?borrowing_id=' + this.props.borrowing_id
    return getElementById(path, this.setBorrowingInformation)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    return this.setState({ [attribute]: value })
  }

  // Functions to handle modal
  closeModal = () => {
    return this.props.closeModal()
  }

  // Functions related to requests
  setBorrowingInformation = (response, body) => {
    if (response == 'success') {
      // This line renders the modal only if the request was successful
      document.getElementById('modal').style.display = 'block'

      let array = body.article_list
      let list = []

      for (let i = 0; i < array.length; i++) {
        let obj = array[i].Articulo

        list.push(obj.Tipo.article_type_name + ' - ' + obj.label.toUpperCase())
      }

      return this.setState({
        user_name: body.Asociado.user_name,
        warehouse_name: body.article_list[0].Articulo.Bodega.warehouse_name,
        article_list: list,
      })
    }

    this.props.handleAlerts(response, body)

    return this.props.closeModal()
  }

  responseHandler = (response, body) => {
    sessionStorage.removeItem('returnings')
    this.props.handleAlerts(response, body)
    return this.props.closeModal()
  }

  createReturning = () => {
    // Verify that obs are valid
    if (!validateString(this.state.obs)) {
      this.responseHandler('attention', INVALID_STRING_MESSAGE)
      return
    }

    let body = {
      state: this.state.physical_state,
      obs: this.state.obs,
      borrowing_fk: this.props.borrowing_id,
      auth_user_fk: sessionStorage.getItem('user_id'),
    }

    simpleRequest(CREATE_RETURNING, 'POST', body, this.responseHandler)
  }

  // Auxiliary functions
  setArticleList() {
    let articles = this.state.article_list

    let list = []
    for (let i = 0; i < articles.length; i++) {
      list.push(
        <li key={articles[i]}>
          <span className='global-modal-text'>{articles[i]}</span>
        </li>
      )
    }

    return list
  }

  render() {
    let article_list = this.setArticleList()

    return (
      <div
        id='modal'
        className='global-modal-background'
        style={{ display: 'none' }}
      >
        <div className='global-modal-container'>
          <div className='global-modal-header'>
            <span className='global-modal-title'>
              Crear constancia para solicitud # {this.props.borrowing_id}
            </span>
            <img
              className='global-modal-icon'
              src='./close_white.png'
              alt='close'
              onClick={this.closeModal}
            />
          </div>
          <div className='global-modal-body'>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Nombre responsable</span>
              <span className='global-modal-text'>{this.state.user_name}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Bodega</span>
              <span className='global-modal-text'>
                {this.state.warehouse_name}
              </span>
            </div>
            <div
              className='global-modal-group-container'
              style={{ alignItems: 'flex-start' }}
            >
              <span className='global-form-label'>Artículos a devolver</span>
              <ul>{article_list}</ul>
            </div>

            <div className='global-modal-group-container'>
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
                {setSelectOptions(STATES)}
              </select>
            </div>

            <div className='global-modal-group-container'>
              <span className='global-form-label'>Observaciones</span>
              <input
                id='obs'
                type='text'
                className='global-form-input'
                maxlength='255'
                value={this.state.obs}
                onChange={this.handleChange}
              />
            </div>
            <div className='global-modal-button-container'>
              <button
                className='global-form-outline-button'
                style={{ height: '30px' }}
                onClick={this.closeModal}
              >
                Cancelar
              </button>
              <button
                className='global-form-solid-button'
                style={{ height: '30px' }}
                onClick={this.createReturning}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreationModal
