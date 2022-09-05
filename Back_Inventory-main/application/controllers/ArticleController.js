const db = require('../models');
const { exportsArticlesToExcel } = require('../services/makefile');
const fs = require('fs');

exports.create = async (req, res, next) => {
    try {
        const parent = await db.article_type.findOne({ where: { id: req.body.article_type_fk } });
        if (parent != null) {
            if (parent.is_parent === 0) {
                var count = await db.article.count({}) + 1;
                var article_label = parent.classif.substring(0, 3) +'-'+ parent.article_type_name.substring(0, 3) + '-' + req.body.branch.substring(0, 3) + '-' + count;
                const registro = await db.article.create({
                    label: article_label.toUpperCase(),
                    available_state: req.body.available_state,
                    physical_state: req.body.physical_state,
                    branch: req.body.branch,
                    warehouse_fk: req.body.warehouse_fk,
                    article_type_fk: req.body.article_type_fk,
                    obs: req.body.obs
                });
                res.status(200).send({
                    message: 'El artículo fue creado con éxito.'
                });
            }
            else {
                const array = req.body.secondary_article_list;
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
                        var article_label = parent.classif.substring(0, 3) +'-'+ parent.article_type_name.substring(0, 3) + '-' + req.body.branch.substring(0, 3) + '-' + count;
                        const registro = await db.article.create({
                            label: article_label,
                            available_state: req.body.available_state,
                            physical_state: req.body.physical_state,
                            branch: req.body.branch,
                            warehouse_fk: req.body.warehouse_fk,
                            article_type_fk: req.body.article_type_fk,
                            obs: req.body.obs
                        });
                        const ObjectParent = await db.article.findOne({ where: { id: registro.id } });
                        if (ObjectParent) {
                            for (var i = 0; i < array.length; i++) {
                                const type = await db.article_type.findOne({ where: { id: array[i].article_type_fk } });
                                if (type.is_parent === 0) {
                                    var count = await db.article.count({}) + 1;
                                    var articlelabel = type.classif.substring(0, 3) +'-'+ type.article_type_name.substring(0, 3) + '-' + array[i].branch.substring(0, 3) + '-' + count;
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
                        res.status(404).send({
                            error: 'No es posible realizar la creación y asociación del artículo.'
                        });
                    }
                }
                else {
                    res.status(404).send({
                        error: 'No es posible realizar la asociación del artículo.'
                    });
                }
            }
        }
        else {
            res.status(404).send({
                error: 'No se encontro el tipo de artículo.'
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
        const { article_type } = req.query;
        const { branch } = req.query;
        const { warehouse_id } = req.query;

        if (article_type && branch && warehouse_id) {
            const registro = await db.article.findAndCountAll({
                where: {
                    article_type_fk: article_type,
                    branch: branch,
                    warehouse_fk: warehouse_id
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
            if(article_type){
                const registro = await db.article.findAndCountAll({
                    where: {
                        article_type_fk: article_type,
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
            else{
                if(branch){
                    const registro = await db.article.findAndCountAll({
                        where: {
                            branch: branch,
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
                else{
                    if(warehouse_id){
                        const registro = await db.article.findAndCountAll({
                            where: {
                                warehouse_fk: warehouse_id
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
                    else{
                        const registro = await db.article.findAndCountAll({
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
            },{
                where:{ id: article.id }
            });
            const article_updated = await db.article.findOne({where: {id: article.id}});
            const article_label = parent.classif.substring(0, 3) + '-' +
                parent.article_type_name.substring(0, 3) + '-' +
                article_updated.branch.substring(0, 3) + '-' + article_updated.id;

            const register_label = await db.article.update({
                label: article_label.toUpperCase()
            },{
                where: {id: article_updated.id}
            });

            if(parent.is_parent === 0){
                res.status(200).send({
                    message: 'El artículo fue modificado con éxito.'
                });
            }else{
                const asociate = await db.article.findAll({where: { article_fk: article.id}});
                for (var i = 0; i < asociate.length; i++) {
                    const parent_asociate = await db.article_type.findOne({ 
                        where: { id: asociate[i].article_type_fk } 
                    });
                    const register_asociate = await db.article.update({
                        available_state: article_updated.available_state,
                        branch: article_updated.branch,
                        warehouse_fk: article_updated.warehouse_fk,
                    },{
                        where:{ id: asociate[i].id }
                    });
                    const asociate_updated = await db.article.findOne({ where: {id: asociate[i].id}});
                    const asociate_label = parent_asociate.classif.substring(0,3)+ '-' +
                    parent_asociate.article_type_name.substring(0,3)+ '-' +
                    asociate_updated.branch.substring(0,3)+ '-' + asociate_updated.id;

                    const register_label_asociate = await db.article.update({
                        label: asociate_label.toUpperCase()
                    },{
                        where: {id: asociate_updated.id}
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

exports.makefile = async (req,res,next) =>{
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
        
        res.download(excel,(err) =>{
            if(err){
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
