import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import AuxiliaryForm from './AuxiliaryForm'
import { setSelectOptions, compareDates } from '../../Functions/Helpers'
import { getWarehouses } from '../../Functions/Get'
import { simpleRequest } from '../../Functions/Post'
import {
  CREATE_BORROWING,
  MANDATORY_MESSAGE,
  ALERT_TIMEOUT,
  ERROR_MESSAGE,
  NO_ITEMS_ERROR,
} from '../../Functions/Constants'

class CreateBorrowing extends Component {
  constructor() {
    super()
    this.myRef = React.createRef()
    this.state = {
      // Request states
      name: sessionStorage.getItem('user_name'),
      user_id: sessionStorage.getItem('user_id'),
      email: sessionStorage.getItem('user_email'),
      warehouse_fk: 0,
      pick_up_date: '',
      return_date: '',

      // Auxiliary form states
      classif: '',
      alert: '',
      timeout: '',
      cont: 1,
      secondaryArticles: [
        <AuxiliaryForm
          id={'sf-1'}
          key={'sf-1'}
          scroll={this.scroll}
          responseHandler={this.responseHandler}
          delete={this.deleteSecondaryForm}
        />,
      ],
      warehouses: [],
    }
  }

  componentDidMount() {
    getWarehouses(this.setWarehouses)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    if (attribute == 'warehouse_fk') {
      sessionStorage.setItem('borrowing_warehouse_fk', value)
    }

    return this.setState({ [attribute]: value })
  }

  clearInputs = () => {
    sessionStorage.removeItem('borrowing_warehouse_fk')

    this.setState({
      warehouse_fk: 0,
      pick_up_date: '',
      return_date: '',

      // Auxiliary form states
      classif: '',
      cont: 1,
      secondaryArticles: [],
    })

    let array = []
    array.push(
      <AuxiliaryForm
        id={'sf-1'}
        key={'sf-1'}
        scroll={this.scroll}
        responseHandler={this.responseHandler}
        delete={this.deleteSecondaryForm}
      />
    )

    return this.setState({
      secondaryArticles: array,
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

  scroll = () => {
    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  // Functions related to requests
  responseHandler = (response, body) => {
    if (response == 'success') {
      sessionStorage.removeItem('borrowings')
      sessionStorage.removeItem('filtered_borrowings')
      sessionStorage.removeItem('borrowing_warehouse_fk')
      this.buildAlert('success', 'Solicitud creada con éxito.')

      return this.clearInputs()
    }

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No hay elementos que mostrar con las selecciones que ha realizado.'
      )
    }

    if (body == 'No warehouse') {
      return this.buildAlert('attention', 'Primero debe elegir una bodega.')
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  componentWillUnmount() {
    localStorage.clear()
    clearTimeout(this.state.timeout)
  }

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

  createBorrowing = () => {
    this.close()
    this.scroll()

    // Verify that the required fields are filled
    if (!this.checkMandatoryInputs()) {
      setTimeout(() => this.buildAlert('attention', MANDATORY_MESSAGE), 10)
      return
    }

    let pick_up_date = this.state.pick_up_date + '-05:00'
    let return_date = this.state.return_date + '-05:00'
    let today = new Date()

    if (
      compareDates(today.toISOString(), pick_up_date) ||
      compareDates(today.toISOString(), return_date)
    ) {
      setTimeout(
        () =>
          this.buildAlert(
            'attention',
            'Verifique que las fechas ingresadas son mayores a la fecha actual.'
          ),
        10
      )
      return
    }

    if (compareDates(pick_up_date, return_date)) {
      setTimeout(
        () =>
          this.buildAlert(
            'attention',
            'Verifique que la fecha de retorno sea mayor que la fecha de recogida.'
          ),
        10
      )
      return
    }

    let body = {
      user_id: this.state.user_id,
      pick_up_date: pick_up_date,
      return_date: return_date,
      article_list: [],
    }

    for (let i = 1; i <= this.state.cont; i++) {
      if (localStorage.getItem('sf-' + i) == 'delete') {
        continue
      }
      if (localStorage.getItem('sf-' + i) == 'incomplete') {
        setTimeout(
          () =>
            this.buildAlert(
              'attention',
              'Asegúrese de diligenciar correctamente todos los campos de los formularios de artículos.'
            ),
          10
        )
        return
      } else {
        body.article_list.push({ article_id: localStorage.getItem('sf-' + i) })
      }
    }

    return simpleRequest(CREATE_BORROWING, 'POST', body, this.responseHandler)
  }

  // Auxiliary functions
  checkMandatoryInputs() {
    if (this.state.warehouse_fk < 0) {
      return false
    }

    if (!this.state.pick_up_date) {
      return false
    }

    if (!this.state.return_date) {
      return false
    }

    return true
  }

  addNewSecondaryForm = () => {
    let array = this.state.secondaryArticles
    let newCont = this.state.cont + 1

    array.push(
      <AuxiliaryForm
        id={'sf-' + newCont}
        key={'sf-' + newCont}
        scroll={this.scroll}
        responseHandler={this.responseHandler}
        delete={this.deleteSecondaryForm}
      />
    )

    return this.setState({ secondaryArticles: array, cont: newCont })
  }

  deleteSecondaryForm = (key) => {
    if (this.state.secondaryArticles.length == 1) {
      return
    }

    let array = this.state.secondaryArticles
    for (let i = 0; i < array.length; i++) {
      if (array[i].key == key) {
        array.splice(i, 1)
        continue
      }
    }

    this.setState({ secondaryArticles: [] })

    return this.setState({ secondaryArticles: array })
  }

  enableChildForms = () => {
    let length = this.state.secondaryArticles.length

    if (length > 0) {
      let array = []

      for (let i = 0; i < length; i++) {
        array.push(this.state.secondaryArticles[i])
      }

      return (
        <div className='cb-secondary-form-container'>
          {array}
          <div className='cb-secondary-form-add-container'>
            <img
              className='cb-add-icon'
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

    return
  }

  render() {
    let forms = this.enableChildForms()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title' ref={this.myRef}>
          Solicitud de préstamo
        </span>
        <span className='global-comp-description'>
          Diligencie el formulario para solicitar un préstamo. Todos los campos
          son obligatorios.
        </span>
        <div className='global-comp-form-container'>
          <span className='global-comp-sub-title'>SOLICITUD</span>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Nombre solicitante
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='name'
              type='text'
              value={this.state.name}
              onChange={this.handleChange}
              className='global-form-input'
              disabled={true}
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Correo solicitante
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='email'
              value={this.state.email}
              onChange={this.handleChange}
              className='global-form-input'
              type='email'
              disabled={true}
            />
          </div>

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
              Fecha de recogida
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='pick_up_date'
              value={this.state.pick_up_date}
              onChange={this.handleChange}
              className='global-form-input'
              type='datetime-local'
            />
          </div>

          <div className='global-form-group'>
            <span className='global-form-label'>
              Fecha de devolución
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <input
              id='return_date'
              value={this.state.return_date}
              onChange={this.handleChange}
              className='global-form-input'
              type='datetime-local'
            />
          </div>

          <span className='global-comp-sub-title'>ARTÍCULOS</span>
          {forms}

          <div
            className='global-form-buttons-container'
            style={{ margin: '0px' }}
          >
            <button
              className='global-form-solid-button'
              onClick={this.createBorrowing}
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

export default CreateBorrowing
