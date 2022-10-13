import React, { Component } from 'react'
import './Styles.css'

import {
  setSelectOptions,
  setSelectArticleOptions,
} from '../../Functions/Helpers'
import { getArticles, getArticleTypes } from '../../Functions/Get'
import { CLASSIFICATIONS, BRANCHES, NO_ITEMS_ERROR } from '../../Functions/Constants'

class AuxiliaryForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Request states
      article_fk: 0,

      // Auxiliary form states
      classif: '',
      article_type_fk: 0,
      branch: '',
      article_types: [],
      articles: [],
      form_name: 'Nuevo Artículo',
    }

    this.prevState = {
      // Validate previous states
      article_fk: '',

      // Validate previous form states
      classif: '',
      article_type_fk: 0,
      branch: '',
    }
  }

  componentDidMount() {
    localStorage.setItem(this.props.id, 'incomplete')
  }

  componentDidUpdate() {
    if (this.state.article_fk !== this.prevState.article_fk) {
      if (this.checkMandatoryInputs()) {
        localStorage.setItem(this.props.id, this.state.article_fk)
      }
    }
  }

  componentWillUnmount() {
    localStorage.setItem(this.props.id, 'delete')
  }

  // Functions to handle states
  handleChange = (event) => {
    let warehouse = sessionStorage.getItem('borrowing_warehouse_fk')
      ? parseInt(sessionStorage.getItem('borrowing_warehouse_fk'))
      : 0

    if (warehouse < 1) {
      this.props.scroll()
      return this.props.responseHandler('error', 'No warehouse')
    }

    let comp_attribute = event.target.id.split('-')
    let attribute = comp_attribute[2]
    let value = event.target.value

    if (attribute == 'classif') {
      this.setState({
        article_type_fk: 0,
        article_fk: 0,
        branch: '',
        article_types: [],
        articles: [],
        form_name: 'Nuevo Artículo',
      })

      getArticleTypes(value, this.setArticleTypes)
    }

    if (attribute == 'article_type_fk') {
      this.setState({
        article_fk: 0,
        branch: '',
        articles: [],
        form_name: 'Nuevo Artículo',
      })
    }

    if (attribute == 'branch') {
      this.setState({
        article_fk: 0,
        form_name: 'Nuevo Artículo',
      })

      getArticles(
        warehouse,
        this.state.article_type_fk,
        value,
        this.setArticles
      )
    }

    if (attribute == 'article_fk') {
      this.setArticleTypeName(value)
    }

    return this.setState({ [attribute]: value })
  }

  setArticleTypes = (response, body) => {
    if (response == 'success') {
      return this.setState({ article_types: body })
    }

    if (body == NO_ITEMS_ERROR) {
      this.props.scroll()
      return this.props.responseHandler('error', NO_ITEMS_ERROR)
    }

    this.props.scroll()
    return this.props.responseHandler('error', body)
  }

  setArticles = (response, body) => {
    if (response == 'success') {
      this.setState({ articles: [] })
      return this.setState({ articles: body })
    }

    if (body == NO_ITEMS_ERROR) {
      this.props.scroll()
      return this.props.responseHandler('error', NO_ITEMS_ERROR)
    }

    this.props.scroll()
    return this.props.responseHandler('error', body)
  }

  setArticleTypeName = (value) => {
    let array = this.state.articles

    for (let i = 0; i < array.length; i++) {
      let obj = array[i]

      if (obj.id == value) {
        return this.setState({
          form_name: obj.name + ':' + obj.label.toUpperCase(),
        })
      }
    }

    return
  }

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

  checkMandatoryInputs() {
    if (this.state.article_type_fk < 0) {
      return false
    }

    if (!this.state.branch) {
      return false
    }

    if (!this.state.classif) {
      return false
    }

    return true
  }

  render() {
    return (
      <div className='af-container'>
        <div className='af-header-container'>
          <img
            className='af-delete-icon'
            src='./remove_gray.png'
            alt='delete'
            onClick={this.delete}
          />
          <div className='af-header'>
            <span className='af-header-title'>{this.state.form_name}</span>
            <img
              className='af-arrow-icon'
              src='./arrow_gray.png'
              alt='arrow'
              onClick={this.collapse}
            />
          </div>
        </div>
        <div
          id={this.props.id}
          className='af-body-container'
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
              Rama
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id={this.props.id + '-' + 'branch'}
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
            <span className='global-form-label'>
              Artículo
              <strong className='global-form-mandatory'> *</strong>
            </span>
            <select
              id={this.props.id + '-' + 'article_fk'}
              className='global-form-input-select'
              value={this.state.article_fk}
              onChange={this.handleChange}
            >
              <option
                value={0}
                className='global-form-input-select-option'
                disabled={true}
              >
                Seleccione un artículo...
              </option>
              {setSelectArticleOptions(this.state.articles)}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default AuxiliaryForm
