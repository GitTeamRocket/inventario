const xlsx = require('xlsx')
const path = require('path')

const date = () => {
  const ts = Date.now()

  const date = new Date(ts)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = year + '-' + month + '-' + day

  return today
}

const exportExcel = (data, workSheetColumnNames, excel, workSheetName) => {
  const workBook = xlsx.utils.book_new()
  const workSheetData = [workSheetColumnNames, ...data]
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData)
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName)
  xlsx.writeFile(workBook, excel)
}

const exportsArticlesToExcel = (articles) => {
  const excel = date() + '-' + 'Articulos.xlsx'

  const workSheetColumnNames = [
    'ID',
    'ETIQUETA',
    'CLASIFICACIÓN',
    'TIPO DE ARTICULO',
    'RAMA',
    'DISPONIBILIDAD',
    'ESTADO',
    'PERTENECE',
    'OBSERVACIONES',
    'FECHA DE INGRESO',
  ]
  const workSheetName = 'Articulos'

  const data = articles.rows.map((article) => {
    return [
      article.id,
      article.label,
      article.Tipo.classif,
      article.Tipo.article_type_name,
      article.branch,
      article.available_state,
      article.physical_state,
      article.Asociado ? article.Asociado.label : '',
      article.obs,
      article.createdAt,
    ]
  })
  const excel_file = exportExcel(
    data,
    workSheetColumnNames,
    excel,
    workSheetName
  )

  return excel
}

const exportsReturningToExcel = (returnings) => {
  const excel = date() + '-' + 'Devoluciones.xlsx'

  const workSheetColumnNames = [
    'ID',
    'ESTADO',
    'SOLICITANTE',
    'EMAIL',
    'ESTADO DE LOS ARTICULOS',
    'ARTICULOS SOLICITADOS',
    'OBSERVACIONES',
  ]

  const workSheetName = 'Devoluciones'

  const data = returnings.map((returning) => {
    var article = ''
    for (var j = 0; j < returning.article_list.length; j++) {
      const id = returning.article_list[j].Articulo.id
      article += id + ','
    }

    if (article.charAt(article.length - 1) == ',') {
      article = article.substring(0, article.length - 1)
    }

    return [
      returning.id,
      returning.auth_state,
      returning.solicitud.Asociado.user_name,
      returning.solicitud.Asociado.email,
      returning.state,
      article,
      returning.obs,
    ]
  })

  const excel_file = exportExcel(
    data,
    workSheetColumnNames,
    excel,
    workSheetName
  )

  return excel
}

const exportsBorrowingToExcel = (borrowings) => {
  const excel = date() + '-' + 'Prestamos.xlsx'

  const workSheetColumnNames = [
    'ID',
    'ESTADO',
    'SOLICITANTE',
    'EMAIL',
    'FECHA RECOGIDA',
    'FECHA DEVOLUCION',
    'ARTICULOS SOLICITADOS',
    'OBSERVACIONES',
  ]

  const workSheetName = 'Prestamos'

  const data = borrowings.map((borrowing) => {
    var article = ''

    for (var j = 0; j < borrowing.article_list.length; j++) {
      const id = borrowing.article_list[j].Articulo.id
      article += id + ','
    }

    if (article.charAt(article.length - 1) == ',') {
      article = article.substring(0, article.length - 1)
    }

    return [
      borrowing.id,
      borrowing.auth_state,
      borrowing.Asociado.user_name,
      borrowing.Asociado.email,
      borrowing.pick_up_date,
      borrowing.return_date,
      article,
      borrowing.obs,
    ]
  })

  const excel_file = exportExcel(
    data,
    workSheetColumnNames,
    excel,
    workSheetName
  )

  return excel
}

module.exports = {
  exportsArticlesToExcel,
  exportsReturningToExcel,
  exportsBorrowingToExcel,
}
