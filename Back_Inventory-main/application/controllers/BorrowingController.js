const db = require('../models')
const mailService = require('../services/mail')
const { exportsBorrowingToExcel } = require('../services/makefile')
const fs = require('fs')

exports.create = async (req, res, next) => {
  try {
    const User = await db.user.findOne({ where: { id: req.body.user_id } })
    if (User != null) {
      const array = req.body.article_list
      if (array != null) {
        let ican = 0
        for (var j = 0; j < array.length; j++) {
          const type = await db.article.findOne({
            where: { id: array[j].article_id },
          })
          if (type) {
            ican += 1
          }
        }
        if (ican === array.length) {
          const registro = await db.borrowing.create({
            user_fk: req.body.user_id,
            auth_state: 'Pendiente',
            pick_up_date: req.body.pick_up_date,
            return_date: req.body.return_date,
            obs: req.body.obs,
            has_returning: 0,
          })
          const borrowing = await db.borrowing.findOne({
            where: { id: registro.id },
          })
          if (borrowing != null) {
            for (var i = 0; i < array.length; i++) {
              const reservacion = await db.reservation.create({
                article_fk: array[i].article_id,
                borrowing_fk: borrowing.id,
              })
            }
          }

          const type_request = 'borrowing'
          const action_type = 'creation'
          const auth = true
          mailService.enviar(
            User,
            type_request,
            action_type,
            borrowing.id,
            auth
          )

          res.status(200).send({
            message: 'El préstamo fue creado con éxito.',
          })
        } else {
          res.status(404).send({
            error: 'No seleccionó un artículo existente.',
          })
        }
      } else {
        res.status(404).send({
          error: 'No hay registros en el sistema.',
        })
      }
    } else {
      res.status(404).send({
        error: 'No hay registros en el sistema.',
      })
    }
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    const { has_returning } = req.query
    if (has_returning == 'false') {
      const borro = await db.borrowing.findAndCountAll({
        where: {
          has_returning: 0,
          auth_state: 'Aprobada',
        },
        include: [
          {
            model: db.user,
            attributes: ['user_name', 'email'],
            required: true,
            as: 'Asociado',
          },
          {
            model: db.user,
            attributes: ['user_name', 'email'],
            as: 'Autoriza',
          },
        ],
      })
      if (borro.count != 0) {
        res.status(200).json(borro)
      } else {
        res.status(404).send({
          error: 'No hay registros en el sistema.',
        })
      }
    } else {
      const borro = await db.borrowing.findAndCountAll({
        include: [
          {
            model: db.user,
            attributes: ['user_name', 'email'],
            required: true,
            as: 'Asociado',
          },
          {
            model: db.user,
            attributes: ['user_name', 'email'],
            as: 'Autoriza',
          },
        ],
      })
      if (borro.count != 0) {
        res.status(200).json(borro)
      } else {
        res.status(404).send({
          error: 'No hay registros en el sistema.',
        })
      }
    }
  } catch (err) {
    return res.status(500).json({ error: '¡Error en el servidor!' })
  }
}

exports.detail = async (req, res, next) => {
  const { borrowing_id } = req.query
  try {
    const borro = await db.borrowing.findAndCountAll({
      where: { id: borrowing_id },
      include: [
        {
          model: db.user,
          attributes: ['user_name', 'email'],
          required: true,
          as: 'Asociado',
        },
        {
          model: db.user,
          attributes: ['user_name', 'email'],
          as: 'Autoriza',
        },
      ],
    })

    const array = []
    var datareal = []
    for (var i = 0; i < borro.count; i++) {
      console.log('a')
      var element = await db.reservation.findAndCountAll({
        attributes: ['id', 'borrowing_fk', 'article_fk'],
        where: { borrowing_fk: borro.rows[i].id },
        include: {
          model: db.article,
          attributes: ['label', 'id', 'warehouse_fk', 'article_type_fk'],
          as: 'Articulo',

          include: [
            {
              model: db.article_type,
              attributes: ['classif', 'article_type_name'],
              as: 'Tipo',
            },
            {
              model: db.warehouse,
              attributes: ['warehouse_name'],
              as: 'Bodega',
            },
          ],
        },
      })
      array.push(element)
      datareal.push(
        Object.assign(borro.rows[i].dataValues, { article_list: array[i].rows })
      )
    }

    if (borro.count != 0) {
      res.status(200).json(datareal)
    } else {
      res.status(404).send({
        error: 'No hay registros en el sistema.',
      })
    }
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}

exports.approve = async (req, res, next) => {
  try {
    const { obs } = req.body
    const { auth_user_fk } = req.body

    if (auth_user_fk) {
      const register = await db.borrowing.update(
        { auth_state: 'Aprobada', obs: obs, auth_user_fk: auth_user_fk },
        {
          where: {
            id: req.body.borrowing_id,
          },
        }
      )

      //update available_state articles.
      if (register == 1) {
        const borrowing = await db.borrowing.findOne({
          where: { id: req.body.borrowing_id },
        })
        const element = await db.reservation.findAndCountAll({
          where: { borrowing_fk: borrowing.id },
        })
        for (var i = 0; i < element.count; i++) {
          const data = await db.article.update(
            { available_state: 'Prestado' },
            {
              where: { id: element.rows[i].article_fk },
            }
          )
        }
      }

      //send confirmation borrowing email.
      const prestamo = await db.borrowing.findOne({
        where: { id: req.body.borrowing_id },
      })

      const user = await db.user.findOne({ where: { id: prestamo.user_fk } })

      const type_request = 'borrowing'
      const action_type = 'auth'
      const auth = true
      mailService.enviar(user, type_request, action_type, prestamo.id, auth)
      res.status(200).send({
        message: 'Constancia de préstamo aprobada.',
      })
    } else {
      res.status(404).send({
        error: 'No es posible aprobar la constancia de préstamo.',
      })
    }
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}

exports.reject = async (req, res, next) => {
  try {
    const { obs } = req.body
    const { auth_user_fk } = req.body

    const aprovar = await db.borrowing.update(
      { auth_state: 'Denegado', obs: obs, auth_user_fk: auth_user_fk },
      {
        where: {
          id: req.body.borrowing_id,
        },
      }
    )

    const prestamo = await db.borrowing.findOne({
      where: { id: req.body.borrowing_id },
    })

    const user = await db.user.findOne({ where: { id: prestamo.user_fk } })

    const type_request = 'borrowing'
    const action_type = 'auth'
    const auth = false
    mailService.enviar(user, type_request, action_type, prestamo.id, auth)
    res.status(200).send({
      message: 'Constancia de préstamo rechazada.',
    })
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const updateBorrowing = await db.borrowing.update(
      {
        pick_up_date: req.body.pick_up_date,
        return_date: req.body.return_date,
        auth_state: req.body.auth_state,
        obs: req.body.obs,
        has_returning: 0,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )

    res.status(200).send({
      message: 'Prestamo modificado con éxito.',
    })
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}

exports.makefile = async (req, res, next) => {
  try {
    const borrowings = await db.borrowing.findAndCountAll({
      include: [
        {
          model: db.user,
          attributes: ['user_name', 'email'],
          required: true,
          as: 'Asociado',
        },
        {
          model: db.user,
          attributes: ['user_name', 'email'],
          as: 'Autoriza',
        },
      ],
    })

    const array = []
    var datareal = []
    for (var i = 0; i < borrowings.count; i++) {
      var element = await db.reservation.findAndCountAll({
        attributes: ['id', 'borrowing_fk', 'article_fk'],
        where: { borrowing_fk: borrowings.rows[i].id },
        include: {
          model: db.article,
          attributes: ['label', 'id', 'article_type_fk'],
          as: 'Articulo',
          include: {
            model: db.article_type,
            attributes: ['classif', 'article_type_name'],
            as: 'Tipo',
          },
        },
      })
      array.push(element)
      datareal.push(
        Object.assign(borrowings.rows[i].dataValues, {
          article_list: array[i].rows,
        })
      )
    }

    const excel = exportsBorrowingToExcel(datareal)

    res.download(excel, (err) => {
      if (err) {
        fs.unlinkSync(excel)
        res.status(404).send({
          message: 'Error al generar el archivo.',
        })
      }
      fs.unlinkSync(excel)
    })
  } catch (error) {
    res.status(500).send({
      error: '¡Error en el servidor!',
    })
    next(error)
  }
}
