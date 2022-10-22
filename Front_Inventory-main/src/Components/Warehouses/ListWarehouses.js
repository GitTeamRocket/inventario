import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import { getElements } from '../../Functions/Get'
import {
  LIST_WAREHOUSES,
  ALERT_TIMEOUT,
  NO_ITEMS_ERROR,
  NO_ITEM_MESSAGE,
  ERROR_MESSAGE,
} from '../../Functions/Constants'

class ListWarehouses extends Component {
  constructor() {
    super()
    this.state = {
      warehousesList: [],
      filtered_warehousesList: [],

      // Auxiliary form states
      alert: '',
      timeout: '',
    }
  }

  componentDidMount() {
    getElements('warehousesList', LIST_WAREHOUSES, this.setWarehousesList)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    return this.setState({ [attribute]: value })
  }

  routeEdit = (event) => {
    let id = event.target.id.split('-')
    sessionStorage.setItem('edit_warehouse_id', id[1])

    return this.props.changeSelected(18)
  }

  // Functions to handle requests
  setWarehousesList = async (response, body) => {
    if (response == 'success') {
      return this.setState({ warehousesList: body })
    }

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

  setTable() {
    let rows = this.state.warehousesList

    if (rows.length < 1) {
      return (
        <span className='global-body-text' style={{ marginBottom: '0px' }}>
          Actualmente no hay bodegas con los filtros seleccionados.
        </span>
      )
    }

    let table_rows = []
    for (let i = 0; i < rows.length; i++) {
      let obj = rows[i]

      table_rows.push(
        <tr key={'tr' + obj.id}>
          <td>{obj.warehouse_name}</td>
          <td>{obj.desc}</td>
          <td>{obj.address}</td>
          <td>
          </td>
        </tr>
      )
    }

    let table = (
      <table>
        <tbody>
          <tr>
            <th>Nombre de la bodega</th>
            <th>Descripción</th>
            <th>Dirección</th>
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
        <span className='global-comp-title'>Lista de bodegas</span>
        <span className='global-comp-description'>
          Aquí podrá listar todas las bodegas de la aplicación de inventario.
          Utilice las listas desplegables para filtrar los elementos.
        </span>
        <div className='global-comp-form-container'>
          {table}
        </div>
      </div>
    )
  }
}

export default ListWarehouses