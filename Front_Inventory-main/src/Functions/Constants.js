const { REACT_APP_HOST } = process.env

// SELECT OPTIONS
export const BRANCHES = [
  { name: 'Cachorros', value: 'Cachorros' },
  { name: 'Lobatos', value: 'Lobatos' },
  { name: 'Webelos', value: 'Webelos' },
  { name: 'Scouts', value: 'Scouts' },
  { name: 'Rovers', value: 'Rovers' },
  { name: 'Tropa', value: 'Tropa' },
  { name: 'Intendencia', value: 'Intendencia' },
  { name: 'Auxiliar', value: 'Auxiliar' },
]

export const CLASSIFICATIONS = [
  { name: 'Elementos de cocina', value: 'Elementos de cocina' },
  { name: 'Elementos de programa', value: 'Elementos de programa' },
  { name: 'Elementos para acampar', value: 'Elementos para acampar' },
]

export const AVAILABILITIES = [
  { name: 'Disponible', value: 'Disponible' },
  { name: 'Prestado', value: 'Prestado' },
  { name: 'Dado de baja', value: 'Dado de baja' },
]

export const STATES = [
  { name: 'Funcional', value: 'Funcional' },
  { name: 'Incompleto', value: 'Incompleto' },
  { name: 'No funcional', value: 'No funcional' },
]

export const AUTH_STATES = [
  { name: 'Pendiente', value: 'Pendiente' },
  { name: 'Denegado', value: 'Denegado' },
  { name: 'Aprobada', value: 'Aprobada' },
]

export const ROL_TYPES = [
  { name: 'Administrador', value: 'administrador' },
  { name: 'Jefe De Bodega', value: 'jefe de bodega' },
  { name: 'Jefe De Rama', value: 'jefe de rama' },
]

// SERVICES
export const HOST = REACT_APP_HOST
  ? REACT_APP_HOST
  : 'http://localhost:3001/api/'
export const LOGIN = 'user/login'
export const LIST_USERS = 'user/list'
export const USERS_BY_ID = 'user/detail'
export const CREATE_USER = 'user/create'
export const MODIFY_USER = 'user/update'

export const CREATE_WAREHOUSE = 'warehouse/create'
export const LIST_WAREHOUSES = 'warehouse/list'

export const CREATE_ARTICLE_TYPE = 'article_type/create'
export const ARTICLE_TYPE_LIST = 'article_type/list'

export const LIST_ARTICLES = 'article/list'
export const CREATE_ARTICLE = 'article/create'
export const MODIFY_ARTICLE = 'article/update'
export const GET_FILE_ARTICLE = 'article/makefile'

export const CREATE_BORROWING = 'borrowing/create'
export const LIST_BORROWINGS = 'borrowing/list'
export const BORROWING_BY_ID = 'borrowing/id'
export const BORROWING_APPROVED = 'borrowing/approved'
export const BORROWING_REJECTED = 'borrowing/rejected'
export const MODIFY_BORROWING = 'borrowing/update'
export const GET_FILE_BORROWING = 'borrowing/makefile'

export const LIST_RETURNINGS = 'returning/list'
export const RETURNING_BY_ID = 'returning/id'
export const CREATE_RETURNING = 'returning/create'
export const MODIFY_RETURNING = 'returning/update'
export const RETURNING_APPROVED = 'returning/approved'
export const RETURNING_REJECTED = 'returning/rejected'
export const GET_FILE_RETURNING = 'returning/makefile'

export const RECOVER_PASSWORD = 'user/recover_pass'
export const TOKEN_VERIFICATION = 'user/token_verification'
export const PASSWORD_CHANGE = 'user/password_change'

// ALERTS
export const MANDATORY_MESSAGE =
  'Verifique que ha llenado todos los campos obligatorios.'
export const ERROR_MESSAGE =
  'Ha ocurrido un error. Por favor intente más tarde.'
export const EMAIL_MESSAGE =
  'El formato del correo electrónico no es válido. Por favor verifique.'
export const NO_ITEM_MESSAGE =
  'No hay registros disponibles para esta selección.'
export const INVALID_STRING_MESSAGE =
  'Alguno de los campos ingresados supera la extensión permitida o se detectó un patrón inválido. Por favor revise los campos.'
export const ALERT_TIMEOUT = 6000

// ERRORS
export const NO_ITEMS_ERROR = 'No hay registros en el sistema.'
export const INVALID_CLASSIF_ERROR = 'La clasificación es inválida.'
export const INVALID_LOGIN_ERROR = 'Error en el usuario o contraseña.'
export const USED_EMAIL_ERROR = 'El correo electrónico ya se encuentra en uso.'
export const ARTICLE_TYPE_EXIST_ERROR = 'El tipo de artículo deseado ya existe.'
export const NO_EMAIL_ERROR =
  'El correo electrónico no se encuentra registrado.'

// OTHERS
export const DAY_IN_MS = 1000 * 60 * 60 * 24
export const DATE_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}
