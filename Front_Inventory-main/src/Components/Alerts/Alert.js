import React, { Component } from 'react'
import './Styles.css'

class Alert extends Component {
  closeAlert = () => {
    document.getElementById('alert').style.display = 'none'
    return this.props.close()
  }

  render() {
    let type = this.props.type
    let text = this.props.text

    return (
      <div id='alert' className={'a-container ' + type + '-border'}>
        <div className={'a-icon-container ' + type + '-background'}>
          <img className='a-icon' src={'./' + type + '_white.png'} alt={type} />
        </div>
        <div className='a-body-container'>{text}</div>
        <div className='a-close-container'>
          <img
            className='a-icon'
            src='./close_gray.png'
            alt='close'
            onClick={this.closeAlert}
          />
        </div>
      </div>
    )
  }
}

export default Alert
