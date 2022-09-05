import {
  HOST,
  LIST_WAREHOUSES,
  ARTICLE_TYPE_LIST,
  LIST_ARTICLES,
  LIST_BORROWINGS,
  DAY_IN_MS,
  NO_ITEMS_ERROR,
  INVALID_CLASSIF_ERROR,
} from './Constants'

function handleErrors(response) {
  if (response.status >= 500) {
    throw Error(response.statusText)
  }
  return response
}

function getFromStorage(key) {
  let session_object = sessionStorage.getItem(key)
  let json_object = JSON.parse(session_object)

  if (json_object && json_object.length > 0) {
    return json_object
  }

  return null
}

function validateResponse(response) {
  if (response.hasOwnProperty('error')) {
    return response.error
  }

  if (!response.hasOwnProperty('rows')) {
    if (response.length < 1) {
      return NO_ITEMS_ERROR
    }

    return null
  }

  let rows = response.rows
  if (rows.length < 1) {
    return NO_ITEMS_ERROR
  }

  return null
}

// CUSTOM GET REQUEST
export function getWarehouses(responseHandler) {
  let data_stored = getFromStorage('warehouses', responseHandler)
  if (data_stored != null) {
    return responseHandler('success', data_stored)
  }

  // Make the request if there is nothing stored
  let url = HOST + LIST_WAREHOUSES
  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      let warehouses = []
      let rows = response.rows
      for (let i = 0; i < rows.length; i++) {
        let obj = rows[i]

        warehouses.push({ value: obj.id, name: obj.warehouse_name })
      }

      let json = JSON.stringify(warehouses)
      sessionStorage.setItem('warehouses', json)

      return responseHandler('success', warehouses)
    })
    .catch((error) => responseHandler('error', error))
}

export function getArticleTypes(classif, responseHandler) {
  let session_classif = ''
  switch (classif) {
    case 'Elementos de cocina':
      session_classif = 'kitchen'
      break
    case 'Elementos de programa':
      session_classif = 'prog'
      break
    case 'Elementos para acampar':
      session_classif = 'camp'
      break
    default:
      return responseHandler('error', INVALID_CLASSIF_ERROR)
  }

  let data_stored = getFromStorage(
    'article_types_' + session_classif,
    responseHandler
  )
  if (data_stored != null) {
    return responseHandler('success', data_stored)
  }

  // Make the request if there is nothing stored
  let url = HOST + ARTICLE_TYPE_LIST + '?classif=' + classif
  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      let article_types = []
      let rows = response.rows
      for (let i = 0; i < rows.length; i++) {
        let obj = rows[i]

        article_types.push({
          value: obj.id,
          name: obj.article_type_name,
          is_parent: obj.is_parent == 1 ? true : false,
        })
      }

      let json = JSON.stringify(article_types)
      sessionStorage.setItem('article_types_' + session_classif, json)

      return responseHandler('success', article_types)
    })
    .catch((error) => responseHandler('error', error))
}

export function getArticles(warehouse, article_type, branch, responseHandler) {
  let params =
    '?warehouse_id=' +
    warehouse +
    '&article_type=' +
    article_type +
    '&branch=' +
    branch
  let url = HOST + LIST_ARTICLES + params

  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      let articles = []
      let rows = response.rows
      for (let i = 0; i < rows.length; i++) {
        let obj = rows[i]

        articles.push({
          id: obj.id,
          label: obj.label,
          branch: obj.branch,
          available_state: obj.available_state,
          physical_state: obj.physical_state,
          obs: obj.obs,
          name: obj.Tipo.article_type_name,
          classif: obj.Tipo.classif,
          warehouse_fk: obj.Bodega.id,
        })
      }

      return responseHandler('success', articles)
    })
    .catch((error) => responseHandler('error', error))
}

export function getAllArticleTypes(responseHandler) {
  let url = HOST + ARTICLE_TYPE_LIST
  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      let articles = []
      let rows = response.rows
      for (let i = 0; i < rows.length; i++) {
        let obj = rows[i]

        articles.push({
          value: obj.id,
          name: obj.article_type_name,
        })
      }

      return responseHandler('success', articles)
    })
    .catch((error) => responseHandler('error', error))
}

export function getFilteredBorrowings(responseHandler) {
  let data_stored = getFromStorage('filtered_borrowings', responseHandler)
  if (data_stored != null) {
    return responseHandler('success', data_stored)
  }

  // Make the request if there is nothing stored
  let url = HOST + LIST_BORROWINGS + '?has_returning=false'
  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      // Calculation of the delay of a returning
      let rows = response.rows
      for (let i = 0; i < rows.length; i++) {
        if (Date.parse(rows[i].return_date) > Date.now()) {
          rows[i].delay = 'No hay retraso'
        } else {
          let delay_days =
            (Date.now() - Date.parse(rows[i].return_date)) / DAY_IN_MS
          if (delay_days < 1) {
            rows[i].delay = 'Se debe entregar hoy'
          } else if (delay_days < 2) {
            rows[i].delay = 'La entrega está retrasada por 1 día'
          } else {
            rows[i].delay =
              'La entrega está retrasada por ' +
              Math.trunc(delay_days) +
              ' días'
          }
        }
      }

      let json = JSON.stringify(rows)
      sessionStorage.setItem('filtered_borrowings', json)

      return responseHandler('success', rows)
    })
    .catch((error) => responseHandler('error', error))
}

// SIMPLE GET REQUESTS
export function getElementById(path, responseHandler) {
  // Path should have id as param
  let url = HOST + path

  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      if (response.hasOwnProperty('error')) {
        return responseHandler('error', response.error)
      }

      if (response.hasOwnProperty('rows')) {
        return responseHandler('success', response.rows[0])
      }

      return responseHandler('success', response[0])
    })
    .catch((error) => responseHandler('error', error))
}

export function getElements(key, path, responseHandler) {
  let data_stored = getFromStorage(key, responseHandler)
  if (data_stored != null) {
    return responseHandler('success', data_stored)
  }

  // Make the request if there is nothing stored
  let url = HOST + path
  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((response) => {
      let validation = validateResponse(response)
      if (validation != null) {
        return responseHandler('error', validation)
      }

      let rows = response.rows ? response.rows : response
      let json = JSON.stringify(rows)
      sessionStorage.setItem(key, json)

      return responseHandler('success', rows)
    })
    .catch((error) => responseHandler('error', error))
}

export function getFile(path, responseHandler) {
  // Path should have id as param
  let url = HOST + path

  fetch(url, {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  })
    .then(handleErrors)
    .then((response) => {
      if (response.hasOwnProperty('error')) {
        return responseHandler('error', response.error)
      }

      return response
    })
    .then((response) => {
      return response.blob()
    })
    .then((blob) => {
      return responseHandler('success', blob)
    })
    .catch((error) => responseHandler('error', error))
}
