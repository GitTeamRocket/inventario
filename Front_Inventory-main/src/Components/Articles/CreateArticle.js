import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import SecondaryForm from './SecondaryForm'
import { setSelectOptions, validateString } from '../../Functions/Helpers'
import { simpleRequestWithFiles } from '../../Functions/Post'
import { getWarehouses, getArticleTypes } from '../../Functions/Get'
import {
  CREATE_ARTICLE,
  MANDATORY_MESSAGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
  CLASSIFICATIONS,
  AVAILABILITIES,
  STATES,
  BRANCHES,
  NO_ITEMS_ERROR,
  INVALID_STRING_MESSAGE,
} from '../../Functions/Constants'

class CreateArticle extends Component {
  constructor() {
    super()
    this.myRef = React.createRef()
    this.state = {
      // Request states
      available_state: '',
      physical_state: '',
      branch: '',
      obs: '',
      warehouse_fk: 0,
      article_type_fk: 0,
      files: [],

      // Auxiliary form states
      classif: '',
      alert: '',
      timeout: '',
      cont: 0,
      secondary_articles: [],
      secondary_article_list: [],
      warehouses: [],
      article_types: [],
    }
  }

  componentDidMount() {
    getWarehouses(this.setWarehouses)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    if (attribute == 'article_type_fk') {
      for (let i = 0; i < this.state.article_types.length; i++) {
        let obj = this.state.article_types[i]
        if (obj.value == value && obj.is_parent) {
          let array = []
          array.push(
            <SecondaryForm
              id='sf-0'
              key='sf-0'
              scroll={this.scroll}
              delete={this.deleteSecondaryForm}
              responseHandler={this.responseHandler}
              setSecondaryFormList={this.setSecondaryFormList}
            />
          )
          this.setState({
            secondary_articles: array,
            cont: 0,
          })
          continue
        }

        if (obj.value == value && !obj.is_parent) {
          this.setState({
            secondary_articles: [],
            cont: 0,
          })
          continue
        }
      }
    }

    if (attribute == 'classif') {
      getArticleTypes(value, this.setArticleTypes);
    }

    if (attribute == 'files') {
      return this.setState({[attribute]: event.target.files[0]});
    }

    return this.setState({ [attribute]: value });
  }

  clearInputs = () => {
    return this.setState({
      available_state: '',
      physical_state: '',
      branch: '',
      obs: '',
      warehouse_fk: 0,
      article_type_fk: 0,
      classif: '',
      cont: 0,
      secondary_articles: [],
      secondary_article_list: [],
    })
  }

  setWarehouses = (response, body) => {
    if (response == 'success') {
      return this.setState({ warehouses: body })
    }

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert('attention', 'No hay bodegas creadas.')
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  setArticleTypes = (response, body) => {
    if (response == 'success') {
      document.getElementById('article_type_fk').disabled = false

      return this.setState({ article_types: body })
    }

    if (body == NO_ITEMS_ERROR) {
      document.getElementById('article_type_fk').disabled = true
      this.setState({ article_types: [] })

      return this.buildAlert(
        'attention',
        'No hay tipos de artículo asociados a la clasificación seleccionada.'
      )
    }

    document.getElementById('article_type_fk').disabled = true
    this.setState({ article_types: [] })

    return this.buildAlert('error', ERROR_MESSAGE)
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
  responseHandler = (response, body) => {
    if (response == 'success') {
      this.buildAlert('success', 'Artículo creado con éxito.')
      return this.clearInputs()
    }

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No hay tipos de artículo asociados a la clasificación seleccionada.'
      )
    }

    return this.buildAlert('error', body)
  }

  createArticle = () => {
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
      available_state: this.state.available_state,
      physical_state: this.state.physical_state,
      branch: this.state.branch,
      obs: this.state.obs,
      warehouse_fk: this.state.warehouse_fk,
      article_type_fk: this.state.article_type_fk,
      files: this.state.files
    }

    if (this.state.secondary_articles.length > 0) {
      if (!this.checkSecondaryMandatoryInputs()) {
        setTimeout(() => this.buildAlert('attention', MANDATORY_MESSAGE), 10)
        return
      } else if (!this.checkSecondaryObservations()) {
        setTimeout(
          () => this.buildAlert('attention', INVALID_STRING_MESSAGE),
          10
        )
        return
      } else {
        body.secondary_article_list = JSON.stringify(this.state.secondary_article_list)
      }
    }

    return simpleRequestWithFiles(CREATE_ARTICLE, 'POST', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (this.state.warehouse_fk < 0) {
      return false
    }

    if (this.state.article_type_fk < 0) {
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

  checkSecondaryMandatoryInputs() {
    let array = this.state.secondary_article_list

    if (array.length < 1) {
      return false
    }

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]

      if (obj.warehouse_fk < 0) {
        return false
      }

      if (obj.article_type_fk < 0) {
        return false
      }

      if (!obj.available_state) {
        return false
      }

      if (!obj.physical_state) {
        return false
      }

      if (!obj.branch) {
        return false
      }
    }

    return true
  }

  checkSecondaryObservations() {
    let array = this.state.secondary_article_list

    if (array.length < 1) {
      return false
    }

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]

      if (!validateString(obj.obs)) {
        return false
      }
    }

    return true
  }

  setSecondaryFormList = (body) => {
    let array = this.state.secondary_article_list
    let set = false

    for (let i = 0; i < array.length; i++) {
      if (array[i].key == body.key) {
        set = true
        array[i] = body
        array[i].warehouse_fk = this.state.warehouse_fk
        array[i].branch = this.state.branch

        continue
      }
    }

    if (!set) {
      array.push(body)
    }

    return
  }

  addNewSecondaryForm = () => {
    let array = this.state.secondary_articles
    let newCont = this.state.cont + 1

    array.push(
      <SecondaryForm
        id={'sf-' + newCont}
        key={'sf-' + newCont}
        scroll={this.scroll}
        delete={this.deleteSecondaryForm}
        responseHandler={this.responseHandler}
        setSecondaryFormList={this.setSecondaryFormList}
      />
    )

    return this.setState({ secondary_articles: array, cont: newCont })
  }

  deleteSecondaryForm = (key) => {
    if (this.state.secondary_articles.length == 1) {
      this.scroll()
      setTimeout(
        () =>
          this.buildAlert(
            'attention',
            'Los artículos compuestos deben tener al menos un artículo secundario.'
          ),
        10
      )
      return
    }

    let array = this.state.secondary_articles
    for (let i = 0; i < array.length; i++) {
      if (array[i].key == key) {
        array.splice(i, 1)
        continue
      }
    }

    this.setState({ secondary_articles: [] })

    return this.setState({ secondary_articles: array })
  }

  enableChildForms = () => {
    let length = this.state.secondary_articles.length

    if (length > 0) {
      let array = []

      for (let i = 0; i < length; i++) {
        array.push(this.state.secondary_articles[i])
      }

      return (
        <div className='ca-secondary-form-container'>
          {array}
          <div className='ca-secondary-form-add-container'>
            <img
              className='ca-add-icon'
              src='./add_gray.png'
              alt='add'
              onClick={this.addNewSecondaryForm}
            />
            <span
              className='sf-header-title'
              style={{ cursor: 'pointer' }}
              onClick={this.addNewSecondaryForm}
            >
              Agregar artículo
            </span>
          </div>
        </div>
      )
    }

    return (
      <span className='global-body-text'>
        El tipo de artículo seleccionado no posee elementos secundarios.
      </span>
    )
  }

  render() {
    let forms = this.enableChildForms()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title' ref={this.myRef}>
          Crear artículo
        </span>
        <span className='global-comp-description'>
          Diligencie el formulario para crear un artículo. Los campos marcados
          con <strong className='global-form-mandatory'>*</strong> son
          obligatorios.
        </span>
        <div className='global-comp-form-container' encType="multipart/form-data">
          <span className='global-comp-sub-title'>ARTÍCULO PRINCIPAL</span>
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
              Clasificación
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id='classif'
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
              id='article_type_fk'
              className='global-form-input-select'
              value={this.state.article_type_fk}
              onChange={this.handleChange}
              disabled={true}
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

          <div className='global-form-group'>
            <span className='global-form-label'>Añadir Imagen</span>
            <input
              id='files'
              type='file'
             // value={this.state.files}
              onChange={this.handleChange}
            />
          </div>

          <span className='global-comp-sub-title'>ARTÍCULOS SECUNDARIOS</span>
          {forms}

          <div
            className='global-form-buttons-container'
            style={{ margin: '0px' }}
          >
            <button
              className='global-form-solid-button'
              onClick={this.createArticle}
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

export default CreateArticle
