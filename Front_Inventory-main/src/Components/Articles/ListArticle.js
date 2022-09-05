import React, { Component } from 'react'
import { saveAs } from 'file-saver'
import './Styles.css'

import Alert from '../Alerts/Alert'
import Modal from './Modal'
import {
  getFile,
  getArticles,
  getWarehouses,
  getAllArticleTypes,
} from '../../Functions/Get'
import { setSelectOptions } from '../../Functions/Helpers'
import {
  GET_FILE_ARTICLE,
  AVAILABILITIES,
  ALERT_TIMEOUT,
  NO_ITEM_MESSAGE,
  NO_ITEMS_ERROR,
  ERROR_MESSAGE,
} from '../../Functions/Constants'

class ListArticle extends Component {
  constructor() {
    super()
    this.state = {
      articles: [],
      article_types: [],
      warehouses: [],
      warehouse_fk: '',
      article_type_fk: '',
      available_state_fk: '',
      value: '',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    let warehouse = ''
    let article_type_fk = ''

    getArticles(warehouse, article_type_fk, this.state.value, this.setArticles)
    getWarehouses(this.setWarehouses)
    getAllArticleTypes(this.setArticleTypes)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    if (attribute == 'warehouse_fk') {
      let warehouse = value
      getArticles(
        warehouse,
        this.state.article_type_fk,
        this.state.value,
        this.setArticles
      )
    }

    if (attribute == 'article_type_fk') {
      let article_type_fk = value
      getArticles(
        this.state.warehouse_fk,
        article_type_fk,
        this.state.value,
        this.setArticles
      )
    }

    if (attribute == 'available_state_fk') {
      this.setState({ [attribute]: value })
      getArticles(
        this.state.warehouse_fk,
        this.state.article_type_fk,
        this.state.value,
        this.setArticles
      )
    }

    return this.setState({ [attribute]: value })
  }

  routeEdit = (event) => {
    let id = event.target.id.split('-')
    let articles = this.state.articles
    let article = {}

    for (let i = 0; i < articles.length; i++) {
      let obj = articles[i]
      if (parseInt(id[1]) == obj.id) {
        article = obj
        continue
      }
    }

    let json = JSON.stringify(article)
    sessionStorage.setItem('edit_article', json)

    return this.props.changeSelected(8)
  }

  // Functions related to requests
  setArticles = async (response, body) => {
    if (response == 'success') {
      let temp = []
      if (!this.state.warehouse_fk) {
        if (!this.state.available_state_fk) {
          return this.setState({ articles: body })
        } else {
          for (let z = 0; z < body.length; z++) {
            if (
              body[z]['available_state'].toLowerCase() ==
              this.state.available_state_fk.toLowerCase()
            ) {
              temp.push(body[z])
            }
          }
          return this.setState({ articles: temp })
        }
      }

      for (let x = 0; x < body.length; x++) {
        if (body[x]['warehouse_fk'] == this.state.warehouse_fk) {
          if (!this.state.available_state_fk) {
            temp.push(body[x])
          } else {
            if (
              body[x]['available_state'].toLowerCase() ==
              this.state.available_state_fk.toLowerCase()
            ) {
              temp.push(body[x])
            }
          }
        }
      }

      if (!temp.length) {
        this.setState({ articles: temp })
        return this.buildAlert('attention', NO_ITEM_MESSAGE)
      }

      return this.setState({ articles: temp })
    }

    this.setState({ articles: [] })
    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert('attention', NO_ITEM_MESSAGE)
    }

    return this.buildAlert('attention', ERROR_MESSAGE)
  }

  setWarehouses = (response, body) => {
    if (response == 'success') {
      return this.setState({ warehouses: body })
    }

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert(
        'attention',
        'No hay bodegas registradas en el sistema.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  setArticleTypes = (response, body) => {
    if (response == 'success') {
      return this.setState({ article_types: body })
    }

    this.setState({ article_types: [] })
    if (body == NO_ITEMS_ERROR) {
      document.getElementById('article_type_fk').disabled = true

      return this.buildAlert(
        'attention',
        'No hay tipos de artículo para esta selección.'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  responseHandler = (response, blob) => {
    if (response == 'success') {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      return saveAs(
        blob,
        year + '_' + month + '_' + day + '_' + 'articulos.xlsx'
      )
    }

    return this.buildAlert('error', ERROR_MESSAGE)
  }

  export = () => {
    return getFile(GET_FILE_ARTICLE, this.responseHandler)
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

  // Functions to handle modal
  showModal(name, label, obs) {
    return this.props.showModal(
      <Modal name={name} label={label} obs={obs} closeModal={this.closeModal} />
    )
  }

  closeModal = () => {
    return this.props.closeModal()
  }

  // Auxiliary functions
  setTable() {
    let rows = this.state.articles
    let rol = sessionStorage.getItem('user_rol')

    if (rows.length < 1) {
      return (
        <span className='global-body-text' style={{ marginBottom: '0px' }}>
          Actualmente no hay artículos guardados.
        </span>
      )
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]

      table_rows.push(
        <tr key={obj.id}>
          <td>{obj.label.toUpperCase()}</td>
          <td>{obj.classif}</td>
          <td>{obj.name}</td>
          <td>{obj.branch}</td>
          <td style={{ textTransform: 'capitalize' }}>{obj.available_state}</td>
          <td>{obj.physical_state}</td>
          {obj.obs ? (
            <td>
              <span
                className='global-table-link'
                onClick={() => this.showModal(obj.name, obj.label, obj.obs)}
              >
                Ver más
              </span>
            </td>
          ) : (
            <td>
              <span className='global-table-link' style={{ color: '#999999' }}>
                N/A
              </span>
            </td>
          )}
          {rol != 'jefe de rama' ? (
            <td>
              <span
                id={'e-' + obj.id}
                className='global-table-link'
                onClick={this.routeEdit}
              >
                Editar
              </span>
            </td>
          ) : (
            ''
          )}
        </tr>
      )
    }

    let table = (
      <table>
        <tbody>
          <tr>
            <th>Etiqueta</th>
            <th>Clasificación</th>
            <th>Tipo de artículo</th>
            <th>Rama</th>
            <th>Disponibilidad</th>
            <th>Estado</th>
            <th>Observaciones</th>
            {rol != 'jefe de rama' ? <th>Acciones</th> : ''}
          </tr>
          {table_rows}
        </tbody>
      </table>
    )

    return table
  }

  setExport() {
    let rol = sessionStorage.getItem('user_rol')
    let array = []

    if (rol == 'jefe de rama') {
      return array
    }

    array.push(
      <span className='global-comp-sub-title'>EXPORTAR INVENTARIO</span>
    )
    array.push(
      <span className='global-body-text'>
        Para exportar toda la información de los artículos del inventario, por
        favor de{' '}
        <span className='global-table-link' onClick={this.export}>
          clic aquí
        </span>
        .
      </span>
    )

    return array
  }

  render() {
    let table = this.setTable()
    let exportComp = this.setExport()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Lista de artículos</span>
        <span className='global-comp-description'>
          Aquí podrá listar todos los artículos en existencia. utilice las
          listas desplegables para filtrar los elementos.
        </span>
        <div className='global-comp-form-container'>
          {exportComp}
          <span className='global-comp-sub-title'>
            LISTADO DE ARTÍCULOS FILTRADO
          </span>
          <div className='global-special-form-group'>
            <select
              id='warehouse_fk'
              className='global-special-form-input-select'
              value={this.state.warehouse_fk}
              onChange={this.handleChange}
            >
              <option value=''>Todas las bodegas...</option>
              {setSelectOptions(this.state.warehouses)}
            </select>
            <select
              id='article_type_fk'
              className='global-special-sec-form-input-select'
              value={this.state.article_type_fk}
              onChange={this.handleChange}
            >
              <option value=''>Todos los tipos de artículos...</option>
              {setSelectOptions(this.state.article_types)}
            </select>
            <select
              id='available_state_fk'
              className='global-special-sec-form-input-select'
              value={this.state.available_state_fk}
              onChange={this.handleChange}
            >
              <option value=''>Todos los estados de disponibilidad...</option>
              {setSelectOptions(AVAILABILITIES)}
            </select>
          </div>
          {table}
        </div>
      </div>
    )
  }
}

export default ListArticle
