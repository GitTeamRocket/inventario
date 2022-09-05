const db = require('../models');


exports.add = async (req, res, next) => {
    try {
        const typee = await db.article_type.findOne({ where: { article_type_name: req.body.article_type_name } });
        if (typee) {
            res.status(409).send({
                error: 'El tipo de artículo deseado ya existe.'
            })
        }
        else {
            const Object = await db.article_type.create(req.body);
            if (Object) {
                res.status(200).send({
                    message: 'Tipo de artículo creado exitosamente.'
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.list = async (req, res, next) => {

    try {
        const { classif } = req.query;
        if (classif) {
            const type = await db.article_type.findAndCountAll({
                where: { classif: classif }
            });
            if (type.count != 0) {
                res.status(200).json(type);
            } else {

                res.status(404).send({
                    error: 'No hay registros en el sistema.'
                });
            }
        }
        else {
            const type = await db.article_type.findAndCountAll()
            if (type.count != 0) {
                res.status(200).json(type);
            } else {
                res.status(404).send({
                    error: 'No hay registros en el sistema.'
                });
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: '¡Error en el servidor!' });

    }
};

