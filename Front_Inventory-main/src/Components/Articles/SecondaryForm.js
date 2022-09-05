import React, { Component } from 'react'
import './Styles.css'

import { setSelectOptions } from '../../Functions/Helpers'
import { getArticleTypes } from '../../Functions/Get'
import {
  CLASSIFICATIONS,
  AVAILABILITIES,
  STATES,
  NO_ITEMS_ERROR,
} from '../../Functions/Constants'

class SecondaryForm extends Component {
  constructor() {
    super()
    this.state = {
      // Request states
      available_state: '',
      physical_state: '',
      obs: '',
      article_type_fk: 0,

      // Auxiliary form states
      classif: '',
      article_type: 'Nuevo artículo',
      article_types: [],
    }
  }

  // Functions to handle states
  handleChange = (event) => {
    let comp_attribute = event.target.id.split('-')
    let attribute = comp_attribute[2]
    let value = event.target.value

    if (attribute == 'classif') {
      getArticleTypes(value, this.setArticleTypes)
    }

    if (attribute == 'article_type_fk') {
      this.setArticleTypeName(value)
    }

    this.setState({ [attribute]: value })

    return this.setSecondaryForm(attribute, value)
  }

  setArticleTypes = (response, body) => {
    if (response == 'success') {
      let array = body
      let filtered_array = []

      for (let i = 0; i < array.length; i++) {
        let obj = array[i]

        if (!obj.is_parent) {
          filtered_array.push(obj)
        }
      }

      if (filtered_array.length < 1) {
        this.props.scroll()
        return this.props.responseHandler('error', NO_ITEMS_ERROR)
      }

      return this.setState({ article_types: filtered_array })
    }

    if (body == NO_ITEMS_ERROR) {
      this.props.scroll()
      return this.props.responseHandler('error', NO_ITEMS_ERROR)
    }

    this.props.scroll()
    return this.props.responseHandler('error', body)
  }

  setSecondaryForm = (attribute, value) => {
    let body = {
      key: this.props.id,
      available_state: this.state.available_state,
      physical_state: this.state.physical_state,
      obs: this.state.obs,
      article_type_fk: this.state.article_type_fk,
    }

    body[attribute] = value

    return this.props.setSecondaryFormList(body)
  }

  setArticleTypeName = (value) => {
    let array = this.state.article_types

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]

      if (obj.value == value) {
        return this.setState({ article_type: obj.name })
      }
    }

    return
  }

  // Auxiliary functions
  collapse = () => {
    let component = document.getElementById(this.props.id)

    if (component.style.display == 'block') {
      component.style.display = 'none'
      return
    }

    component.style.display = 'block'
    return
  }

  delete = () => {
    return this.props.delete(this.props.id)
  }

  render() {
    return (
      <div className='sf-container'>
        <div className='sf-header-container'>
          <img
            className='sf-delete-icon'
            src='./remove_gray.png'
            alt='delete'
            onClick={this.delete}
          />
          <div className='sf-header'>
            <span className='sf-header-title'>{this.state.article_type}</span>
            <img
              className='sf-arrow-icon'
              src='./arrow_gray.png'
              alt='arrow'
              onClick={this.collapse}
            />
          </div>
        </div>
        <div
          id={this.props.id}
          className='sf-body-container'
          style={{ display: 'none' }}
        >
          <div className='global-form-group'>
            <span className='global-form-label'>
              Clasificación
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id={this.props.id + '-' + 'classif'}
              className='global-form-input-select'
              value={this.state.classif}
              onChange={this.handleChange}
            >
              <option
                value=''
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione una clasificación...
              </option>
              {setSelectOptions(CLASSIFICATIONS)}
            </select>
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Tipo de artículo
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id={this.props.id + '-' + 'article_type_fk'}
              className='global-form-input-select'
              value={this.state.article_type_fk}
              onChange={this.handleChange}
            >
              <option
                value={0}
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione un tipo de artículo...
              </option>
              {setSelectOptions(this.state.article_types)}
            </select>
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Disponibilidad
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id={this.props.id + '-' + 'available_state'}
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
              id={this.props.id + '-' + 'physical_state'}
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
            <span className='global-form-label'>Observaciones</span>
            <input
              id={this.props.id + '-' + 'obs'}
              type='text'
              className='global-form-input'
              value={this.state.obs}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SecondaryForm
