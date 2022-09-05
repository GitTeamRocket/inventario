import { DATE_OPTIONS } from './Constants'

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Return true if string is valid to store
export function validateString(string) {
  if (String(string).length > 255) {
    return false
  }

  const re =
    /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/gm
  return !re.test(String(string).toUpperCase())
}

export function setSelectOptions(options) {
  if (options.length < 1) {
    return
  }

  let select_options = []

  for (let i = 0; i < options.length; i++) {
    let op = options[i]

    select_options.push(
      <option
        key={op.name}
        className='global-form-input-select-option'
        value={op.value}
      >
        {op.name}
      </option>
    )
  }

  return select_options
}

export function setSelectArticleOptions(options) {
  if (options.length < 1) {
    return
  }

  let select_options = []

  for (let i = 0; i < options.length; i++) {
    let op = options[i]

    select_options.push(
      <option
        key={op.name}
        className='global-form-input-select-option'
        value={op.id}
      >
        {op.name} - {op.label.toUpperCase()}
      </option>
    )
  }

  return select_options
}

export function formatDateToLocal(date_string) {
  let date = new Date(date_string)

  return (
    date.toLocaleDateString('es-CO', DATE_OPTIONS) +
    ' ' +
    date.toLocaleTimeString()
  )
}

export function formatDate(date_string) {
  let date = new Date(date_string)

  let year = date.getFullYear()
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let mins =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month

  return year + '-' + month + '-' + day + 'T' + hours + ':' + mins
}

// Returns true if the first date is greater than the second
export function compareDates(date_1, date_2) {
  let first = new Date(date_1)
  let second = new Date(date_2)

  return first > second
}

export function parseOptionToStatic(num) {
  let id = 's'

  switch (num) {
    case 1:
    case 2:
    case 3:
      return id + 1
    case 4:
      return id + 2
    case 5:
      return id + 3
    case 6:
    case 7:
    case 8:
      return id + 4
    case 9:
    case 10:
    case 11:
    case 12:
      return id + 5
    case 13:
    case 14:
    case 15:
    case 16:
      return id + 6
    default:
      return id + 5
  }
}
