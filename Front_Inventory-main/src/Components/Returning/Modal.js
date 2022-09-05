import React, { Component } from 'react'

import { getElementById } from '../../Functions/Get'
import { RETURNING_BY_ID } from '../../Functions/Constants'

class Modal extends Component {
  constructor() {
    super()
    this.state = {
      // Information states
      user_name: '',
      warehouse_name: '',
      auth_state: '',
      state: '',
      borrowing_fk: 0,
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
    let temp_obs = 'N/A'
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
        borrowing_fk: body.borrowing_fk,
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

  render() {
    let article_list = this.setArticleList()

    return (
      <div id='modal' className='global-modal-background'>
        <div className='global-modal-container'>
          <div className='global-modal-header'>
            <span className='global-modal-title'>
              Constancia de devolución #{this.props.returning_id}
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
            <div className='global-modal-group-container'>
              <span className='global-form-label'>ID préstamo</span>
              <span className='global-modal-text'>
                {this.state.borrowing_fk}
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
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
