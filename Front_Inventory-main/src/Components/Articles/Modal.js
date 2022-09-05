import React, { Component } from 'react'
import './Styles.css'

class Modal extends Component {
  constructor() {
    super()
    this.state = {}
  }

  closeModal = () => {
    return this.props.closeModal()
  }

  render() {
    return (
      <div class='global-modal-background'>
        <div class='global-modal-container'>
          <div className='global-modal-header'>
            <span className='global-modal-title'>Observaciones</span>
            <img
              className='global-modal-icon'
              src='./close_white.png'
              alt='close'
              onClick={this.closeModal}
            />
          </div>
          <div className='global-modal-body'>
            <div className='global-modal-group-container'>
              <span className='global-form-label'>Nombre del artículo</span>
              <span className='global-modal-text'>
                {this.props.name}:{this.props.label.toUpperCase()}
              </span>
            </div>
            <div className='global-modal-group-container'>
              <p className='global-modal-text'>{this.props.obs}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
