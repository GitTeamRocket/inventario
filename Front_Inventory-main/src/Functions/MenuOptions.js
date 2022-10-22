export function setOptionsByRol(rol, collapse, changeSelected) {
  // STATIC LABELS
  const USERS = (
    <div key='s1' id='s1' className='m-menu-static-label'>
      <img className='m-icon' src='./person_gray.png' alt='person' />
      <span className='m-label'>Usuarios</span>
      <img
        id='header-1'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  const WAREHOUSES = (
    <div key='s2' id='s2' className='m-menu-static-label'>
      <img className='m-icon' src='./inventory_gray.png' alt='inventory' />
      <span className='m-label'>Bodegas</span>
      <img
        id='header-2'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  const ARTICLE_TYPES = (
    <div key='s3' id='s3' className='m-menu-static-label'>
      <img className='m-icon' src='./types_gray.png' alt='types' />
      <span className='m-label'>Tipos de artículo</span>
      <img
        id='header-3'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  const ARTICLES = (
    <div key='s4' id='s4' className='m-menu-static-label'>
      <img className='m-icon' src='./articles_gray.png' alt='articles' />
      <span className='m-label'>Artículos</span>
      <img
        id='header-4'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  const BORROWINGS = (
    <div key='s5' id='s5' className='m-menu-static-label'>
      <img className='m-icon' src='./outbox_gray.png' alt='outbox' />
      <span className='m-label'>Préstamos</span>
      <img
        id='header-5'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  const RETURNINGS = (
    <div key='s6' id='s6' className='m-menu-static-label'>
      <img className='m-icon' src='./inbox_gray.png' alt='inbox' />
      <span className='m-label'>Devoluciones</span>
      <img
        id='header-6'
        className='m-icon'
        src='./arrow_gray.png'
        alt='arrow'
        onClick={collapse}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )

  // GROUP LABELS
  // USERS
  const LIST_USERS_LABEL = (
    <div key='l1' id={1} className='m-menu-label' onClick={changeSelected}>
      Listar usuarios
    </div>
  )

  const CREATE_USER_LABEL = (
    <div key='l2' id={2} className='m-menu-label' onClick={changeSelected}>
      Crear usuario
    </div>
  )

  const MODIFY_USER_LABEL = (
    <div key='l3' id={3} className='m-menu-label' onClick={changeSelected}>
      Modificar usuario
    </div>
  )

  // WAREHOUSES
  const CREATE_WAREHOUSE_LABEL = (
    <div key='l4' id={4} className='m-menu-label' onClick={changeSelected}>
      Crear bodega
    </div>
  )
  const LIST_WAREHOUSE_LABEL = (
    <div key='l17' id={17} className='m-menu-label' onClick={changeSelected}>
      Listar bodega
    </div>
  )

  const MODIFY_WAREHOUSE_LABEL = (
    <div key='l18' id={18} className='m-menu-label' onClick={changeSelected}>
      Modificar bodega
    </div>
  )

  // ARTICLE TYPES
  const CREATE_ARTICLE_TYPE_LABEL = (
    <div key='l5' id={5} className='m-menu-label' onClick={changeSelected}>
      Crear tipo de artículo
    </div>
  )

  // ARTICLES
  const LIST_ARTICLES_LABEL = (
    <div key='l6' id={6} className='m-menu-label' onClick={changeSelected}>
      Listar artículos
    </div>
  )

  const CREATE_ARTICLE_LABEL = (
    <div key='l7' id={7} className='m-menu-label' onClick={changeSelected}>
      Crear artículo
    </div>
  )

  const MODIFY_ARTICLE_LABEL = (
    <div key='l8' id={8} className='m-menu-label' onClick={changeSelected}>
      Modificar artículo
    </div>
  )

  // BORROWINGS
  const LIST_BORROWINGS_LABEL = (
    <div key='l9' id={9} className='m-menu-label' onClick={changeSelected}>
      Listar préstamos
    </div>
  )

  const CREATE_BORROWING_LABEL = (
    <div key='l10' id={10} className='m-menu-label' onClick={changeSelected}>
      Solicitar préstamo
    </div>
  )

  const MODIFY_BORROWING_LABEL = (
    <div key='l11' id={11} className='m-menu-label' onClick={changeSelected}>
      Modificar préstamo
    </div>
  )

  const AUTH_BORROWING_LABEL = (
    <div key='l12' id={12} className='m-menu-label' onClick={changeSelected}>
      Autorizar préstamo
    </div>
  )

  // RETURNINGS
  const LIST_RETURNINGS_LABEL = (
    <div key='l13' id={13} className='m-menu-label' onClick={changeSelected}>
      Listar constancias
    </div>
  )

  const CREATE_RETURNING_LABEL = (
    <div key='l14' id={14} className='m-menu-label' onClick={changeSelected}>
      Crear constancia
    </div>
  )

  const MODIFY_RETURNING_LABEL = (
    <div key='l15' id={15} className='m-menu-label' onClick={changeSelected}>
      Modificar constancia
    </div>
  )

  const AUTH_RETURNING_LABEL = (
    <div key='l16' id={16} className='m-menu-label' onClick={changeSelected}>
      Autorizar constancias
    </div>
  )

  // GROUPS
  // USERS
  const USERS_GROUP = (
    <div
      key='g1'
      id='group-1'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {LIST_USERS_LABEL}
      {CREATE_USER_LABEL}
      {MODIFY_USER_LABEL}
    </div>
  )

  const WAREHOUSES_GROUP = (
    <div
      key='g2'
      id='group-2'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {CREATE_WAREHOUSE_LABEL}
      {LIST_WAREHOUSE_LABEL}
      {MODIFY_WAREHOUSE_LABEL}
    </div>
  )

  const ARTICLE_TYPES_GROUP = (
    <div
      key='g3'
      id='group-3'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {CREATE_ARTICLE_TYPE_LABEL}
    </div>
  )

  const ARTICLES_GROUP = (
    <div
      key='g4'
      id='group-4'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {LIST_ARTICLES_LABEL}
      {CREATE_ARTICLE_LABEL}
      {MODIFY_ARTICLE_LABEL}
    </div>
  )

  const BORROWINGS_GROUP = (
    <div
      key='g5'
      id='group-5'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {LIST_BORROWINGS_LABEL}
      {CREATE_BORROWING_LABEL}
      {MODIFY_BORROWING_LABEL}
      {AUTH_BORROWING_LABEL}
    </div>
  )

  const RETURNINGS_GROUP = (
    <div
      key='g6'
      id='group-6'
      className='m-menu-group'
      style={{ display: 'none' }}
    >
      {LIST_RETURNINGS_LABEL}
      {CREATE_RETURNING_LABEL}
      {MODIFY_RETURNING_LABEL}
      {AUTH_RETURNING_LABEL}
    </div>
  )

  let array = []

  switch (rol) {
    case 'administrador':
      array.push(USERS)
      array.push(USERS_GROUP)
      array.push(WAREHOUSES)
      array.push(WAREHOUSES_GROUP)
      array.push(ARTICLE_TYPES)
      array.push(ARTICLE_TYPES_GROUP)
      array.push(ARTICLES)
      array.push(ARTICLES_GROUP)
      array.push(BORROWINGS)
      array.push(BORROWINGS_GROUP)
      array.push(RETURNINGS)
      array.push(RETURNINGS_GROUP)

      return array

    case 'jefe de bodega':
      array.push(ARTICLE_TYPES)
      array.push(ARTICLE_TYPES_GROUP)
      array.push(ARTICLES)
      array.push(ARTICLES_GROUP)
      array.push(BORROWINGS)
      array.push(BORROWINGS_GROUP)
      array.push(RETURNINGS)
      array.push(RETURNINGS_GROUP)

      return array

    default:
      let default_articles = (
        <div
          key='g4'
          id='group-4'
          className='m-menu-group'
          style={{ display: 'none' }}
        >
          {LIST_ARTICLES_LABEL}
        </div>
      )
      let default_borrowings = (
        <div id='group-5' className='m-menu-group' style={{ display: 'none' }}>
          {LIST_BORROWINGS_LABEL}
          {CREATE_BORROWING_LABEL}
        </div>
      )
      let default_returnings = (
        <div id='group-6' className='m-menu-group' style={{ display: 'none' }}>
          {LIST_RETURNINGS_LABEL}
          {CREATE_RETURNING_LABEL}
        </div>
      )

      array.push(ARTICLES)
      array.push(default_articles)
      array.push(BORROWINGS)
      array.push(default_borrowings)
      array.push(RETURNINGS)
      array.push(default_returnings)

      return array
  }
}
