import React, { Component } from 'react'

import { getElementById } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  RETURNING_BY_ID,
  RETURNING_APPROVED,
  RETURNING_REJECTED,
} from '../../Functions/Constants'

class AuthModal extends Component {
  constructor() {
    super()
    this.state = {
      // Information states
      user_name: '',
      warehouse_name: '',
      auth_state: '',
      state: '',
      obs: '',
      article_list: [],

      // Form states
      obs: '',
    }
  }

  componentDidMount() {
    let path = RETURNING_BY_ID + '?returning_id=' + this.props.returning_id
    return getElementById(path, this.setReturningInformation)
  }

  setReturningInformation = (response, body) => {
    let temp_obs = 'No tiene ninguna observación.'
    if (response == 'success') {
      // This line renders the modal only if the request was successful
      document.getElementById('modal').style.display = 'block'

      let array = body.article_list
      let list = []

      for (let i = 0; i < array.length; i++) {
        let obj = array[i].Articulo

        list.push(obj.Tipo.article_type_name + ' - ' + obj.label.toUpperCase())
      }

      if (body.obs) {
        temp_obs = body.obs
      }

      return this.setState({
        user_name: body.evaluador.user_name,
        warehouse_name: body.article_list[0].Articulo.Bodega.warehouse_name,
        auth_state: body.auth_state,
        state: body.state,
        obs: temp_obs,
        article_list: list,
      })
    }

    this.props.handleAlerts(response, body)

    return this.props.closeModal()
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    return this.setState({ [attribute]: value })
  }

  responseHandler = (response, body) => {
    this.props.handleAlerts(response, body)
    return this.props.closeModal()
  }

  // Functions to handle modal
  closeModal = () => {
    return this.props.closeModal()
  }

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

  authorize = (event) => {
    let body = {
      returning_id: this.props.returning_id,
    }
    if (event.target.id == 'approve') {
      return simpleRequest(
        RETURNING_APPROVED,
        'PUT',
        body,
        this.responseHandler
      )
    }

    return simpleRequest(RETURNING_REJECTED, 'PUT', body, this.responseHandler)
  }

  render() {
    let article_list = this.setArticleList()

    return (
      <div id='modal' className='global-modal-background'>
        <div className='global-modal-container'>
          <div className='global-modal-header'>
            <span className='global-modal-title'>
              Autorizar devolución de solicitud # {this.props.returning_id}
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
              <span className='global-form-label'>Nombre de responsable</span>
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
              <span className='global-form-label'>Estado de los artículos</span>
              <span className='global-modal-text'>{this.state.state}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Observaciones</span>
              <span className='global-modal-text'>{this.state.obs}</span>
            </div>
            <div className='global-modal-button-container'>
              <button
                id='reject'
                className='global-form-outline-button'
                style={{ height: '30px' }}
                onClick={this.authorize}
              >
                Denegar
              </button>
              <button
                id='approve'
                className='global-form-solid-button'
                style={{ height: '30px' }}
                onClick={this.authorize}
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AuthModal
