const db = require('../models');

exports.create = async (req, res, next) => {
    try {
        const Usuario = await db.user.findOne({ where: { email: req.body.email } });
        if (Usuario) {
            const registro = await db.warehouse.create({
                warehouse_name: req.body.warehouse_name,
                desc: req.body.desc, address: req.body.address, user_fk: Usuario.id
            });
            res.status(200).send({
                message: 'Bodega creada con éxito.'
            });
        } else {
            res.status(404).send({
                error: 'El correo electrónico no se encuentra registrado.'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};


exports.list = async (req, res, next) => {
    try {
        const bodegas = await db.warehouse.findAndCountAll({
            where: {
                state: 1
            },
            include: {
                model: db.user,
                attributes: ['user_name', 'email', 'phone'],
                required: true,
                as: 'encargado',
            }
        });
        if (bodegas.count != 0) {
            res.status(200).json(bodegas);
        } else {
            res.status(404).send({
                error: 'No hay registros en el sistema.'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const registro = await db.warehouse.update({
            warehouse_name: req.body.warehouse_name,
            desc: req.body.desc,
            address: req.body.address
        },
            {
                where: {
                    id: req.body.id
                },
            });
        res.status(200).send({
            message: 'Bodega modificada con éxito.'
        });
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};

exports.detail = async (req, res, next) => {
    const { warehouse_id } = req.query;
    try {
        const onewarehouse = await db.warehouse.findAndCountAll({
            where: { id: warehouse_id },
        });
        if (onewarehouse.count != 0) {
            res.status(200).json(onewarehouse);
        } else {
            res.status(404).send({
                error: 'No hay bodegas en el sistema.'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    const { warehouse_id } = req.body;

    try {
        const warehouse = await db.warehouse.findAndCountAll({
            where: {
                id: warehouse_id
            }
        });

        if (warehouse.count != 0) {
            const articlesActives = await db.article.findAndCountAll({
                where: {
                    warehouse_fk: warehouse_id,
                    state: 1
                }
            });

            if (articlesActives.count == 0) {
                const update = await db.warehouse.update({
                    state: 0
                },
                    {
                        where: {
                            id: warehouse_id
                        }
                    });

                res.status(200).send({
                    message: 'Bodega eliminada con éxito.'
                });
            } else {
                res.status(403).send({
                    error: 'La bodega tiene articulos activos asociadas.'
                });
            }
        } else {
            res.status(404).send({
                error: 'No hay registros en el sistema.'
            });
        }

    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};