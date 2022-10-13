import React, { Component } from 'react'
import './Styles.css'

import { getElementById } from '../../Functions/Get'
import { formatDateToLocal } from '../../Functions/Helpers'
import { BORROWING_BY_ID } from '../../Functions/Constants'

class Modal extends Component {
  constructor() {
    super()
    this.state = {
      // Information states
      user_name: '',
      warehouse_name: '',
      pick_up_date: '',
      return_date: '',
      auth_state: '',
      auth_user: '',
      article_list: [],
      obs: '',
    }
  }

  componentDidMount() {
    let path = BORROWING_BY_ID + '?borrowing_id=' + this.props.borrowing_id
    return getElementById(path, this.setBorrowingInfo)
  }

  // Functions to handle modal
  closeModal = () => {
    return this.props.closeModal()
  }

  // Functions related to requests
  setBorrowingInfo = (response, body) => {
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
        pick_up_date: formatDateToLocal(body.pick_up_date),
        return_date: formatDateToLocal(body.return_date),
        auth_state: body.auth_state,
        auth_user: body.Autoriza ? body.Autoriza.user_name : '',
        obs: body.obs,
      })
    }

    this.props.handleAlerts(response, body)

    return this.props.closeModal()
  }

  responseHandler = (response, body) => {
    this.props.handleAlerts(response, body)
    return this.props.closeModal()
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
    let state = this.state

    return (
      <div id='modal' className='global-modal-background'>
        <div className='global-modal-container'>
          <div className='global-modal-header'>
            <span className='global-modal-title'>
              Solicitud # {this.props.borrowing_id}
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
              <span className='global-form-label'>Nombre solicitante</span>
              <span className='global-modal-text'>{state.user_name}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Fecha recogida</span>
              <span className='global-modal-text'>{state.pick_up_date}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Nombre devolución</span>
              <span className='global-modal-text'>{state.return_date}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Bodega</span>
              <span className='global-modal-text'>{state.warehouse_name}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Estado</span>
              <span className='global-modal-text'>{state.auth_state}</span>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Autorizador</span>
              <span className='global-modal-text'>
                {state.auth_user ? state.auth_user : 'N/A'}
              </span>
            </div>
            <div
              className='global-modal-group-container'
              style={{ alignItems: 'flex-start' }}
            >
              <span className='global-form-label'>Artículos solicitados</span>
              <ul>{article_list}</ul>
            </div>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Observaciones</span>
              <span className='global-modal-text'>
                {state.obs ? state.obs : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
