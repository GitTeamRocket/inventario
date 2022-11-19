const db = require('../models');
const { exportsArticlesToExcel } = require('../services/makefile');
const fs = require('fs');
const path = require('path');

exports.create = async (req, res, next) => {
    let deleteFile = false;
    try {
        const parent = await db.article_type.findOne({ where: { id: req.body.article_type_fk } });
        if (parent != null) {
            if (parent.is_parent === 0) {
                var count = await db.article.count({}) + 1;
                var article_label = parent.classif.substring(0, 3) + '-' + parent.article_type_name.substring(0, 3) + '-' + req.body.branch.substring(0, 3) + '-' + count;
                const registro = await db.article.create({
                    label: article_label.toUpperCase(),
                    available_state: req.body.available_state,
                    physical_state: req.body.physical_state,
                    branch: req.body.branch,
                    warehouse_fk: req.body.warehouse_fk,
                    article_type_fk: req.body.article_type_fk,
                    obs: req.body.obs,
                    image_url: req.file.filename
                });
                res.status(200).send({
                    message: 'El artículo fue creado con éxito.'
                });
            }
            else {
                const array = JSON.parse(req.body.secondary_article_list);
                if (array != null) {
                    let ican = 0;
                    for (var j = 0; j < array.length; j++) {
                        const type = await db.article_type.findOne({ where: { id: array[j].article_type_fk } });
                        if (type.is_parent === 0) {
                            ican += 1;
                        }
                    }
                    if (ican === array.length) {
                        var count = await db.article.count({}) + 1;
                        var article_label = parent.classif.substring(0, 3) + '-' + parent.article_type_name.substring(0, 3) + '-' + req.body.branch.substring(0, 3) + '-' + count;
                        const registro = await db.article.create({
                            label: article_label,
                            available_state: req.body.available_state,
                            physical_state: req.body.physical_state,
                            branch: req.body.branch,
                            warehouse_fk: req.body.warehouse_fk,
                            article_type_fk: req.body.article_type_fk,
                            obs: req.body.obs,
                            image_url: req.file.filename
                        });
                        const ObjectParent = await db.article.findOne({ where: { id: registro.id } });
                        if (ObjectParent) {
                            for (var i = 0; i < array.length; i++) {
                                const type = await db.article_type.findOne({ where: { id: array[i].article_type_fk } });
                                if (type.is_parent === 0) {
                                    var count = await db.article.count({}) + 1;
                                    var articlelabel = type.classif.substring(0, 3) + '-' + type.article_type_name.substring(0, 3) + '-' + array[i].branch.substring(0, 3) + '-' + count;
                                    const registro = await db.article.create({
                                        label: articlelabel,
                                        available_state: array[i].available_state,
                                        physical_state: array[i].physical_state,
                                        branch: array[i].branch,
                                        warehouse_fk: array[i].warehouse_fk,
                                        article_type_fk: type.id,
                                        article_fk: ObjectParent.id,
                                        obs: array[i].obs
                                    });
                                }
                            }

                        }
                        res.status(200).send({
                            message: 'El artículo fue creado con éxito.'
                        });
                    }

                    else {
                        deleteFile = true;
                        res.status(404).send({
                            error: 'No es posible realizar la creación y asociación del artículo.'
                        });
                    }
                }
                else {
                    deleteFile = true;
                    res.status(404).send({
                        error: 'No es posible realizar la asociación del artículo.'
                    });
                }
            }
        }
        else {
            deleteFile = true;
            res.status(404).send({
                error: 'No se encontro el tipo de artículo.'
            });
        }
    } catch (error) {
        deleteFile = true;
        console.log("Error Article Controller - CREATE: ", error);
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    } finally {
        if (deleteFile) {
            fs.unlinkSync(path.join(process.cwd(), "article_images_uploads", req.file.filename));
        }
    }
};

exports.list = async (req, res, next) => {
    try {
        const { article_type } = req.query;
        const { branch } = req.query;
        const { warehouse_id } = req.query;

        if (article_type && branch && warehouse_id) {
            const registro = await db.article.findAndCountAll({
                where: {
                    article_type_fk: article_type,
                    branch: branch,
                    warehouse_fk: warehouse_id,
                    state: 1
                },
                include: [{
                    model: db.article_type,
                    required: true,
                    as: 'Tipo'
                },
                {
                    model: db.warehouse,
                    required: true,
                    as: 'Bodega'
                },
                {
                    model: db.article,
                    as: 'Asociado'
                }],
            });

            if (registro.count != 0) {
                res.status(200).json(registro);
            } else {
                res.status(404).send({
                    error: 'No hay registros en el sistema.'
                });
            }
        }
        else {
            if (article_type) {
                const registro = await db.article.findAndCountAll({
                    where: {
                        article_type_fk: article_type,
                        state: 1
                    },
                    include: [{
                        model: db.article_type,
                        required: true,
                        as: 'Tipo'
                    },
                    {
                        model: db.warehouse,
                        required: true,
                        as: 'Bodega'
                    },
                    {
                        model: db.article,
                        as: 'Asociado'
                    }],
                });

                if (registro.count != 0) {
                    res.status(200).json(registro);
                } else {
                    res.status(404).send({
                        error: 'No hay registros en el sistema.'
                    });
                }
            }
            else {
                if (branch) {
                    const registro = await db.article.findAndCountAll({
                        where: {
                            branch: branch,
                            state: 1
                        },
                        include: [{
                            model: db.article_type,
                            required: true,
                            as: 'Tipo'
                        },
                        {
                            model: db.warehouse,
                            required: true,
                            as: 'Bodega'
                        },
                        {
                            model: db.article,
                            as: 'Asociado'
                        }],
                    });

                    if (registro.count != 0) {
                        res.status(200).json(registro);
                    } else {
                        res.status(404).send({
                            error: 'No hay registros en el sistema.'
                        });
                    }
                }
                else {
                    if (warehouse_id) {
                        const registro = await db.article.findAndCountAll({
                            where: {
                                warehouse_fk: warehouse_id,
                                state: 1
                            },
                            include: [{
                                model: db.article_type,
                                required: true,
                                as: 'Tipo'
                            },
                            {
                                model: db.warehouse,
                                required: true,
                                as: 'Bodega'
                            },
                            {
                                model: db.article,
                                as: 'Asociado'
                            }],
                        });

                        if (registro.count != 0) {
                            res.status(200).json(registro);
                        } else {
                            res.status(404).send({
                                error: 'No hay registros en el sistema.'
                            });
                        }
                    }
                    else {
                        const registro = await db.article.findAndCountAll({
                            where: {
                                state: 1
                            },
                            include: [{
                                model: db.article_type,
                                required: true,
                                as: 'Tipo'
                            },
                            {
                                model: db.warehouse,
                                required: true,
                                as: 'Bodega'
                            },
                            {
                                model: db.article,
                                as: 'Asociado'
                            }],
                        });
                        if (registro.count != 0) {
                            res.status(200).json(registro);
                        } else {
                            res.status(404).send({
                                error: 'No hay registros en el sistema.'
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const article = await db.article.findOne({ where: { id: req.body.id } });
        if (article != null) {
            const parent = await db.article_type.findOne({ where: { id: article.article_type_fk } });
            const register = await db.article.update({
                available_state: req.body.available_state,
                physical_state: req.body.physical_state,
                branch: req.body.branch,
                warehouse_fk: req.body.warehouse_fk,
                obs: req.body.obs
            }, {
                where: { id: article.id }
            });
            const article_updated = await db.article.findOne({ where: { id: article.id } });
            const article_label = parent.classif.substring(0, 3) + '-' +
                parent.article_type_name.substring(0, 3) + '-' +
                article_updated.branch.substring(0, 3) + '-' + article_updated.id;

            const register_label = await db.article.update({
                label: article_label.toUpperCase()
            }, {
                where: { id: article_updated.id }
            });

            if (parent.is_parent === 0) {
                res.status(200).send({
                    message: 'El artículo fue modificado con éxito.'
                });
            } else {
                const asociate = await db.article.findAll({ where: { article_fk: article.id } });
                for (var i = 0; i < asociate.length; i++) {
                    const parent_asociate = await db.article_type.findOne({
                        where: { id: asociate[i].article_type_fk }
                    });
                    const register_asociate = await db.article.update({
                        available_state: article_updated.available_state,
                        branch: article_updated.branch,
                        warehouse_fk: article_updated.warehouse_fk,
                    }, {
                        where: { id: asociate[i].id }
                    });
                    const asociate_updated = await db.article.findOne({ where: { id: asociate[i].id } });
                    const asociate_label = parent_asociate.classif.substring(0, 3) + '-' +
                        parent_asociate.article_type_name.substring(0, 3) + '-' +
                        asociate_updated.branch.substring(0, 3) + '-' + asociate_updated.id;

                    const register_label_asociate = await db.article.update({
                        label: asociate_label.toUpperCase()
                    }, {
                        where: { id: asociate_updated.id }
                    });
                }
                res.status(200).send({
                    message: 'El artículo y sus articulos asociados fueron modificados con éxito.'
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

exports.makefile = async (req, res, next) => {
    try {
        const articles = await db.article.findAndCountAll({
            include: [{
                model: db.article_type,
                required: true,
                as: 'Tipo'
            },
            {
                model: db.warehouse,
                required: true,
                as: 'Bodega'
            },
            {
                model: db.article,
                as: 'Asociado'
            }],
        });

        const excel = exportsArticlesToExcel(articles);

        res.download(excel, (err) => {
            if (err) {
                fs.unlinkSync(excel);
                res.status(404).send({
                    message: "Error al generar el archivo."
                });
            }
            fs.unlinkSync(excel);
        });
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    const { article_id } = req.body;

    try {
        const article = await db.article.findAndCountAll({
            where: {
                id: article_id
            }
        });
        
        console.log(article.rows[0].image_url);
        
        if (article.count != 0) {
            const [results, metadata] = await db.sequelize.query(
                `SELECT DISTINCT a.* FROM articles a 
                LEFT JOIN reservations r ON a.id = r.article_fk 
                LEFT JOIN borrowings b ON b.id = r.borrowing_fk 
                LEFT JOIN returnings rt ON rt.borrowing_fk = b.id
                WHERE (UPPER(rt.auth_state) = "PENDIENTE" 
                OR UPPER(b.auth_state) = "PENDIENTE" 
                OR UPPER(a.available_state) = "PRESTADO")
                AND a.id = ${article_id}`
                );
                
            if (results.length == 0) {
                // const update = await db.article.update({
                //     state: 0
                // },
                //     {
                //         where: {
                //             id: article_id
                //         }
                //     });

                res.status(200).send({
                    message: 'Articulo eliminado con éxito.'
                });
                fs.unlinkSync(path.join(process.cwd(), "article_images_uploads", article.rows[0].image_url));
            } else {
                res.status(403).send({
                    error: 'El articulo tiene prestamos o devoluciones pendientes.'
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
        })
        next(error);
    }
};
