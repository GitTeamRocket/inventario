import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import { getElements } from '../../Functions/Get'
import { setSelectOptions } from '../../Functions/Helpers'
import {
  LIST_USERS,
  ALERT_TIMEOUT,
  NO_ITEMS_ERROR,
  NO_ITEM_MESSAGE,
  ERROR_MESSAGE,
  BRANCHES,
  ROL_TYPES,
} from '../../Functions/Constants'

class ListUsers extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      filtered_users: [],
      rol: 'all',
      branch: 'all',

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    getElements('users', LIST_USERS, this.setUsers)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    this.setState({ [attribute]: value })

    return this.filterUsers(attribute, value)
  }

  routeEdit = (event) => {
    let id = event.target.id.split('-')
    sessionStorage.setItem('edit_user_id', id[1])

    return this.props.changeSelected(3)
  }

  // Functions to handle requests
  setUsers = async (response, body) => {
    if (response == 'success') {
      this.setState({ filtered_users: body })
      return this.setState({ users: body })
    }

    this.setState({ users: [] })

    if (body == NO_ITEMS_ERROR) {
      return this.buildAlert('attention', NO_ITEM_MESSAGE)
    }

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

  // Auxiliary functions
  filterUsers(attribute, value) {
    let rol = 'all'
    let branch = 'all'

    if (attribute == 'rol') {
      rol = value
      branch = this.state.branch
    } else {
      rol = this.state.rol
      branch = value
    }

    let filtered_by_rol = this.filterByRol(rol, this.state.users)
    let filtered_by_branch = this.filterByBranch(branch, filtered_by_rol)

    return this.setState({ filtered_users: filtered_by_branch })
  }

  filterByRol(rol, array) {
    if (rol == 'all') {
      return array
    }

    let filtered_array = []

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]
      if (obj.rol == rol) {
        filtered_array.push(obj)
      }
    }

    return filtered_array
  }

  filterByBranch(branch, array) {
    if (branch == 'all') {
      return array
    }

    let filtered_array = []

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]
      if (obj.branch == branch) {
        filtered_array.push(obj)
      }
    }

    return filtered_array
  }

  setTable() {
    let rows = this.state.filtered_users

    if (rows.length < 1) {
      return (
        <span className='global-body-text' style={{ marginBottom: '0px' }}>
          Actualmente no hay usuarios con los filtros seleccionados.
        </span>
      )
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]

      table_rows.push(
        <tr key={'tr' + obj.id}>
          <td>{obj.id}</td>
          <td>{obj.user_name}</td>
          <td>{obj.email}</td>
          <td>{obj.phone}</td>
          <td>{obj.branch}</td>
          <td style={{ textTransform: 'capitalize' }}>{obj.rol}</td>
          <td>
            <span
              id={'e-' + obj.id}
              className='global-table-link'
              onClick={this.routeEdit}
            >
              Editar
            </span>
          </td>
        </tr>
      )
    }

    let table = (
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Rama</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
          {table_rows}
        </tbody>
      </table>
    )

    return table
  }

  render() {
    let table = this.setTable()

    return (
      <div className='cu-container'>
        {this.state.alert}
        <span className='global-comp-title'>Lista de usuarios</span>
        <span className='global-comp-description'>
          Aquí podrá listar todos los usuarios de la aplicación de inventario.
          Utilice las listas desplegables para filtrar los elementos.
        </span>
        <div className='global-comp-form-container'>
          <div className='global-special-form-group'>
            <select
              id='rol'
              className='global-special-form-input-select'
              value={this.state.rol}
              onChange={this.handleChange}
            >
              <option value='all'>Todos los roles</option>
              {setSelectOptions(ROL_TYPES)}
            </select>
            <select
              id='branch'
              className='global-special-sec-form-input-select'
              value={this.state.branch}
              onChange={this.handleChange}
            >
              <option value='all'>Todas las ramas</option>
              {setSelectOptions(BRANCHES)}
            </select>
          </div>
          {table}
        </div>
      </div>
    )
  }
}

export default ListUsers
