import React, { Component } from 'react'
import './Styles.css'

import Alert from '../Alerts/Alert'
import { validateEmail } from '../../Functions/Helpers'
import { 
  simpleRequest,
  asyncRequest,
} from '../../Functions/Post'
import {
  RECOVER_PASSWORD,
  TOKEN_VERIFICATION,
  PASSWORD_CHANGE,
  ERROR_MESSAGE,
  ALERT_TIMEOUT,
} from '../../Functions/Constants'

class RecoverPassword extends Component {
  constructor() {
    super()
    this.state = {
      aler: '',
      email: '',
      user_id: '',
      token: '',
      password: '',
      conf_password: '',
      conf_step: false,
    }
  }
  // Functions to handle states
  handleChange = (event) => {
    let attribute = event.target.id
    let value = event.target.value

    if (attribute == 'email') {
      value = value.toLowerCase()
    }

    return this.setState({ [attribute]: value })
  }

  responseHandler = (response) => {
    if (response != 'success') {
      return this.buildAlert('error', ERROR_MESSAGE)
    }
    setTimeout(() => {
      return this.props.changeView('Login')
    } , 2000)
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

  // Functions to change the Forms
  changeForm = async (e) => {
    let progressOptions = document.querySelectorAll('.progressbar__option')
    let element = e.target
    let isButtonNext = e.target.classList.contains('step__button--next')
    let isButtonBack = e.target.classList.contains('step__button--back')
    if (isButtonNext || isButtonBack) {
      let currentStep = document.getElementById('step-' + element.dataset.step)
      let jumpStep = document.getElementById('step-' + element.dataset.to_step)
      if(currentStep.id == 'step-1' & jumpStep.id == 'step-2'){
        let resp = await this.step_1()
        if(resp.conf_step)
          this.setState({ conf_step: resp.conf_step })
      } 
      else if(currentStep.id == 'step-2' & jumpStep.id == 'step-3'){
        let resp = await this.step_2()
        if(resp.conf_step)
          this.setState({ conf_step: resp.conf_step, user_id: resp.user_id })
      }
      else {
        let resp = await this.anotherStep()
        this.setState({ conf_step: resp.conf_step })
      }

      if(this.state.conf_step){
        this.setState({ conf_step: false })
        currentStep.addEventListener('animationend', function callback() {
          currentStep.classList.remove('active')
          jumpStep.classList.add('active')
          if (isButtonNext) {
            currentStep.classList.add('to-left')
            progressOptions[element.dataset.to_step - 1].classList.add('active')
          } else {
            jumpStep.classList.remove('to-left')
            progressOptions[element.dataset.step - 1].classList.remove('active')
          }
          currentStep.removeEventListener('animationend', callback)
        })
      
        currentStep.classList.add('inactive')
        jumpStep.classList.remove('inactive')
      }
    }
  }

  // Step 1: send email to generate token
  async step_1() {
    if (!this.state.email) {    
      this.setState({
        alert: <Alert
          type={'error'}
          text={'Digite un correo electronico.'}
          close={this.close} />,
      })
      return { conf_step: false }
    }
    if (!validateEmail(this.state.email)) {  
      this.setState({
        alert: <Alert
          type={'error'}
          text={'El correo digitado no es valido.'}
          close={this.close} />,
      })
      return { conf_step: false }
    }

    let body = {
      user_email: this.state.email,
    }

    let response = asyncRequest(RECOVER_PASSWORD, 'PUT', body).then(x=>{
      if(x.message == "Envio exitoso"){
        let step = { conf_step: true }
        this.setState({
          alert: <Alert
            type={'success'}
            text={x.message}
            close={this.close} />,
        })
        return step  
      }else{
        this.setState({
          alert: <Alert
            type={'error'}
            text={x.error}
            close={this.close} />,
        })
        return { conf_step: false }
      }
    })
    return await response
  }

  // Step 2: Confirm token
  async step_2() {
    if (!this.state.token) {
      this.setState({
        alert: <Alert
          type={'error'}
          text={'No ha escrito el token'}
          close={this.close} />,
      })
      return { conf_step: false }
    }

    let body = {
      token_user: this.state.token,
    }
    
    let response = asyncRequest(TOKEN_VERIFICATION, 'POST', body).then(x=>{
      if(x.id && x.name){
        let step = { conf_step: true, user_id : x.id }
        this.setState({
          alert: <Alert
            type={'success'}
            text={'Bienvenido(a) ' + x.name + ', ya puede restablecer sus contraseñas a continuación.'}
            close={this.close} />,
        })
        return step  
      }else{
        this.setState({
          alert: <Alert
            type={'error'}
            text={'Error con la validación del Token.'}
            close={this.close} />,
        })
        return { conf_step: false }
      }
    })
    return await response
  }

  // Step 3: change user password
  step_3 = () => {
    if (!this.state.password || !this.state.conf_password) {
      return this.setState({
          alert: <Alert
          type={'error'}
          text={'Digite las contraseñas'}
          close={this.close} />,
        })
    }

    if (this.state.password != this.state.conf_password) {
      return this.setState({
        alert: <Alert
        type={'error'}
        text={'Las contraseñas no son iguales'}
        close={this.close} />,
      })
    }

    let body = {
      user_id: this.state.user_id,
      passwd_new: this.state.password,
      passwd_compare: this.state.conf_password,
    }

    simpleRequest(PASSWORD_CHANGE, 'PUT', body, this.responseHandler)
  }

  async anotherStep() {
    let response = { conf_step: true }
    return response
  }

  // Auxiliary functions
  showPasswd() {
    let container = document.getElementById('eye-icon-container')
    let icon = document.getElementById('eye-icon')
    let input = document.getElementById('password')

    if (input.attributes.type.value == 'password') {
      input.attributes.type.value = 'text'
      container.style.backgroundColor = '#b31d1d'
      icon.attributes.src.value = './eye_white.png'
    } else {
      input.attributes.type.value = 'password'
      container.style.backgroundColor = '#f2f4f7'
      icon.attributes.src.value = './eye_gray.png'
    }

    return
  }

  showPasswd_confirm() {
    let container = document.getElementById('eye-icon-container_conf')
    let icon = document.getElementById('eye-icon_conf')
    let input = document.getElementById('conf_password')

    if (input.attributes.type.value == 'password') {
      input.attributes.type.value = 'text'
      container.style.backgroundColor = '#b31d1d'
      icon.attributes.src.value = './eye_white.png'
    } else {
      input.attributes.type.value = 'password'
      container.style.backgroundColor = '#f2f4f7'
      icon.attributes.src.value = './eye_gray.png'
    }
    return
  }

  render() {
    return (
      <div className='lg-container'>
        {this.state.alert}
        <div className='lg-card'>
          <div className='lg-content'>
            <div className='recp-header'>
              <span className='lg-title'>
                Restablecer contraseña
              </span>
              <span className='lg-text'>
                Para realizar el cambio de contraseña asegúrese de cumplir con los siguientes tres pasos.
              </span>
            </div>				
              <div className="lg-form">
                <div className="form-register__header">
                  <ul className="progressbar">
                  <li className="progressbar__option active"><span className='global-form-label'>paso 1</span></li>
                    <li className="progressbar__option"><span className='global-form-label'>paso 2</span></li>
                  <li className="progressbar__option"><span className='global-form-label'>paso 3</span></li>
                  </ul>
                </div>
                <div className="form-register__body">
                <div className="step active" id="step-1">
                  <div className="step__body">
                    <div className='global-explanation-text'>
                      <span className='lg-text'>
                        Digite los siguientes campos para enviar a su correo electrónico un código de 
                        restablecimiento de contrasaeña.
                      </span>
                    </div>
                    <span className='global-form-label'>Correo electrónico</span>
                    <input
                      id='email'
                      className='global-form-input'
                      type='email'
                      value= {this.state.email}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="step__footer">
                    <button
                      onClick={this.changeForm}
                      type="button"
                      className="step__button step__button--next"
                      data-to_step="2"
                      data-step="1">
                        Siguiente
                    </button>
                  </div>
                </div>
                <div className="step" id="step-2">
                  <div className="step__body">
                  <div className='global-explanation-text'>
                    <span className='lg-text'>
                      Digite a continuación el código de restablecimiento que ha sido enviado al correo
                      <span className='global-text-mandatory'> {this.state.email}</span>, 
                      tiene 10 minutos a partir de ahora para que el código que le fue enviado siga siendo valido.
                    </span>
                  </div>
                  <span className='global-form-label'>Código de restablecimiento</span>
                  <input
                    id='token'
                    className='global-form-input'
                    type='text'
                    value={this.state.token}
                    onChange={this.handleChange}
                  />
                  </div>
                  <div className="step__footer">
                  <button
                      onClick={this.changeForm}
                      type="button" 
                      className="step__button_back step__button--back" 
                      data-to_step="1" 
                      data-step="2">
                        Regresar
                    </button>
                    <button
                      onClick={this.changeForm}
                      type="button"
                      className="step__button step__button--next"
                      data-to_step="3"
                      data-step="2">
                        Siguiente
                    </button>
                  </div>
                </div>
                <div className="step" id="step-3">
                  <div className="step__body">
                    <div className='global-explanation-text'>
                      <span className='lg-text'>
                        Digite la nueva contraseña y su confirmación para realizar el restablecimiento, luego
                        podrá ingresar con normalidad al inventario utilizando su nueva contraseña.
                      </span>
                    </div>
                    <span className='global-form-label'>Nueva contraseña</span>								
                    <div className='global-form-input-group'>
                      <div className='recp-form-img-container'>
                        <img
                          className='global-form-img'
                          src='./key_gray.png'
                          alt='key'
                        />
                      </div>
                      <input
                        id='password'
                        value={this.state.password}
                        className='global-form-input'
                        type='password'
                        onChange={this.handleChange}
                        />
                      <div
                        id='eye-icon-container'
                        className='recp-form-img-container'
                        style={{ cursor: 'pointer' }}
                        onClick={this.showPasswd}
                      >
                        <img
                          id='eye-icon'
                          className='global-form-img'
                          src='./eye_gray.png'
                          alt='eye'
                        />
                      </div>
                    </div>
                    <span className='global-form-label'>Confirmar contraseña</span>								
                    <div className='global-form-input-group'>
                      <div className='recp-form-img-container'>
                        <img
                          className='global-form-img'
                          src='./key_gray.png'
                          alt='key'
                        />
                      </div>
                        <input
                          id='conf_password'
                          value={this.state.conf_password}
                          className='global-form-input'
                          type='password'
                          onChange={this.handleChange}
                        />
                      <div
                        id='eye-icon-container_conf'
                        className='recp-form-img-container'
                        style={{ cursor: 'pointer' }}
                        onClick={this.showPasswd_confirm}
                      >
                        <img
                          id='eye-icon_conf'
                          className='global-form-img'
                          src='./eye_gray.png'
                          alt='eye'
                        />
                      </div>
                    </div>
                    
                  </div>
                  <div className="step__footer">
                    <button
                      onClick={this.changeForm}
                      type="button" 
                      className="step__button_back  step__button--back" 
                      data-to_step="2" 
                      data-step="3">
                        Regresar
                    </button>
                    <button
                      onClick= {this.step_3}
                      type="submit"
                      className="step__button">
                        Aceptar
                      </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='lg-logo-container'>
              <img className='lg-logo' src='./logo_Rocket.png' alt='logo' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RecoverPassword