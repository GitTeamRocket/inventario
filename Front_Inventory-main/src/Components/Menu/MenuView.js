import React, { Component } from 'react'
import './Styles.css'

import ListUsers from '../Users/ListUsers'
import CreateUser from '../Users/CreateUser'
import ModifyUser from '../Users/ModifyUser'
import CreateArticleType from '../ArticleType/CreateArticleType'
import CreateWarehouse from '../Warehouses/CreateWarehouse'
import ListWarehouses from '../Warehouses/ListWarehouses'
import ModifyWarehouse from '../Warehouses/ModifyWarehouse'
import ListArticle from '../Articles/ListArticle'
import CreateArticle from '../Articles/CreateArticle'
import ModifyArticle from '../Articles/ModifyArticle'
import ListBorrowings from '../Borrowing/ListBorrowings'
import CreateBorrowing from '../Borrowing/CreateBorrowing'
import AuthBorrowingRequest from '../Borrowing/AuthBorrowingRequest'
import ModifyBorrowing from '../Borrowing/ModifyBorrowing'
import CreateReturning from '../Returning/CreateReturning'
import AuthReturningRequest from '../Returning/AuthReturningRequest'
import ModifyReturning from '../Returning/ModifyReturning'

import { setOptionsByRol } from '../../Functions/MenuOptions'
import { parseOptionToStatic } from '../../Functions/Helpers'
import ListReturnings from '../Returning/ListReturnings'

class MenuView extends Component {
  constructor() {
    super()
    this.state = {
      selected: 0,
      modal: '',
    }
  }

  componentDidMount() {
    this.collapseAll()

    let rol = sessionStorage.getItem('user_rol')
    let id = 'group-'
    let num = 1

    switch (rol) {
      case 'administrador':
        id = id + 1
        break

      case 'jefe de bodega':
        id = id + 3
        num = 5
        break

      default:
        id = id + 4
        num = 6
        break
    }

    this.setState({ selected: num })

    let component = document.getElementById(id)
    component.style.display = 'block'
    document.getElementById(num).className = 'm-menu-label selected'

    id = parseOptionToStatic(num)
    document.getElementById(id).className =
      'm-menu-static-label static-selected'

    return
  }

  // Functions to handle states
  changeSelected = (event) => {
    let newID = parseInt(event.target.id)
    this.changeSelectedStyle(newID)

    return this.setState({ selected: newID })
  }

  changeSelectedFromComponent = (selected) => {
    this.changeSelectedStyle(selected)
    return this.setState({ selected: selected })
  }

  logout = () => {
    this.props.changeView('login')
    return sessionStorage.clear()
  }

  // Functions to handle modal
  showModal = (modal) => {
    this.setState({ modal: modal })
  }

  closeModal = () => {
    this.setState({ modal: '' })
  }

  // Auxiliary functions
  showUserMenu() {
    let visibility = document.getElementById('logout').style.visibility

    if (visibility == 'visible') {
      document.getElementById('logout').style.visibility = 'hidden'
      return
    }

    document.getElementById('logout').style.visibility = 'visible'
    return
  }

  getSubComponent() {
    switch (this.state.selected) {
      case 1:
        return <ListUsers changeSelected={this.changeSelectedFromComponent} />
      case 2:
        return <CreateUser />
      case 3:
        return <ModifyUser />
      case 4:
        return <CreateWarehouse />
      case 5:
        return <CreateArticleType />
      case 6:
        return (
          <ListArticle
            changeSelected={this.changeSelectedFromComponent}
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 7:
        return <CreateArticle />
      case 8:
        return <ModifyArticle />
      case 9:
        return (
          <ListBorrowings
            changeSelected={this.changeSelectedFromComponent}
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 10:
        return <CreateBorrowing />
      case 11:
        return <ModifyBorrowing />
      case 12:
        return (
          <AuthBorrowingRequest
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 13:
        // LIST RETURNINGS
        return (
          <ListReturnings 
            changeSelected={this.changeSelectedFromComponent}
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 14:
        return (
          <CreateReturning
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 15:
        // MODIFY RETURNING
        return <ModifyReturning />
      case 16:
        return (
          <AuthReturningRequest
            showModal={this.showModal}
            closeModal={this.closeModal}
          />
        )
      case 17:
        return (
          <ListWarehouses
            changeSelected={this.changeSelectedFromComponent}
          />
        )
      case 18:
          // MODIFY RETURNING
          return <ModifyWarehouse />
      default:
        return <div></div>
    }
  }

  changeSelectedStyle(newID) {
    document.getElementById(this.state.selected).className = 'm-menu-label'
    document.getElementById(newID).className = 'm-menu-label selected'

    let id = parseOptionToStatic(this.state.selected)
    document.getElementById(id).className = 'm-menu-static-label'

    id = parseOptionToStatic(newID)
    document.getElementById(id).className =
      'm-menu-static-label static-selected'

    return
  }

  collapse = (event) => {
    let id = event.target.id.split('-')[1]
    let component = document.getElementById('group-' + id)

    if (component.style.display === 'block') {
      component.style.display = 'none'
    } else {
      component.style.display = 'block'
      this.collapseAll(id)
    }
    
    return
  }

  collapseAll = (currentMenuId) => {
   for (let i = 1; i <= 16; i++) {
      let id = 'group-' + i
      let component = document.getElementById(id)

      if (component != null && i !== Number(currentMenuId)) {
        component.style.display = 'none'
      }
    }

    return
  }

  getRolOptions() {
    let rol = sessionStorage.getItem('user_rol')

    if (!rol) {
      rol = 'jefe de rama'
    }

    return setOptionsByRol(rol, this.collapse, this.changeSelected)
  }

  render() {
    let menuOptions = this.getRolOptions()
    let component = this.getSubComponent()
    let name = sessionStorage.getItem('user_name')

    if (!name) {
      name = 'Nombre Apellido'
    }

    return (
      <div className='m-container'>
        {this.state.modal}
        <div
          id='logout'
          className='m-close-session'
          style={{ visibility: 'hidden' }}
          onClick={this.logout}
        >
          <img className='m-icon' src='./logout_gray.png' alt='logout' />
          <span className='m-label'>Cerrar sessión</span>
        </div>
        {/* HEADER */}
        <div className='m-header'>
          <div className='m-logo-container'>
            <img className='m-logo' src='./logo-scouts.png' alt='logo' />
            <span className='m-label-header'>Grupo Scout Centinelas 113</span>
          </div>
          <div className='m-loged-user-container' onClick={this.showUserMenu}>
            <div className='m-ellipse'>{name[0]}</div>
            <span className='m-user-name'>{name}</span>
            <img className='m-icon' src='./arrow_gray.png' alt='arrow' />
          </div>
        </div>
        {/* MENU */}
        <div className='m-body-container'>
          <div className='m-menu-container'>{menuOptions}</div>
          {/* SUB COMPONENT */}
          <div className='m-component-container'>{component}</div>
        </div>
      </div>
    )
  }
}

export default MenuView