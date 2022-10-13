const bcrypt = require('bcryptjs');
const db = require('../models');
const tokenServices = require('../services/token');
const jwt = require('jsonwebtoken');
const mailService = require('../services/EmailRecover');

exports.add = async (req, res, next) => {
    try {
        const Usuario = await db.user.findOne({ where: { email: req.body.email } });
        if (Usuario) {

            res.status(409).send({
                error: 'El correo electrónico ya se encuentra en uso.'
            })
        }
        else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            if (
                req.body.rol == "jefe de rama" || 
                req.body.rol == "jefe de bodega" || 
                req.body.rol == "administrador"
            ) {
                const Usuario = await db.user.create({
                    email: req.body.email,
                    user_name: req.body.user_name,
                    branch: req.body.branch,
                    phone: req.body.phone,
                    password: req.body.password,
                    rol: req.body.rol,
                });

                res.status(200).send({
                    message: 'Usuario creado con éxito.'
                });
            }
            else {

                res.status(409).send({
                    error: 'Rol no permitido'
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const Usuario = await db.user.findOne({ where: { email: req.body.email } });
        if (Usuario) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, Usuario.password);
            if (passwordIsValid) {
                const token = await tokenServices.encode(Usuario);
                res.status(200).send({
                    message: 'Bienvenido',
                    token: token,
                    user:
                    {
                        id: Usuario.id,
                        name: Usuario.user_name,
                        email: Usuario.email,
                        rol: Usuario.rol
                    }
                })
            } else {
                //error en la autenticación
                res.status(401).json({
                    error: 'Error en el usuario o contraseña.'
                })
            }
        } else {
            //error en la autenticación
            res.status(404).json({
                error: 'Error en el usuario o contraseña.'
            })
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
        const userss = await db.user.findAndCountAll()
        if (userss.count != 0) {
            res.status(200).json(userss);
        } else {
            res.status(404).send({
                error: 'No hay registros en el sistema.'
            });
        }
    } catch (err) {
        return res.status(500).json({ error: '¡Error en el servidor!' });

    }
};

exports.detail = async (req, res, next) => {
    const { user_id } = req.query;
    try {
        const oneuser = await db.user.findAndCountAll({
            where: { id: user_id },
        });
        if (oneuser.count != 0) {
            res.status(200).json(oneuser);
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
}

exports.update = async (req, res, next) => {
    try {
        const registro = await db.user.update({
            user_name: req.body.user_name,
            branch: req.body.branch,
            phone: req.body.phone,
            email: req.body.email,
            rol: req.body.rol
        },
            {
                where: {
                    id: req.body.id
                },
            });       
        res.status(200).send({
            message: 'Usuario modificado con éxito.'
        });
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};
exports.recoverp = async (req, res, next) => {
    try {
        const { user_email } = req.body;
        if (user_email) {
            
            const Usuario = await db.user.findOne({ where: { email: user_email } });
            if (Usuario) {                
                const randomstring = Math.random().toString(36).slice(-8);
                const token = randomstring;
                const type_request = "New Password";
                const action_type = 'auth';
                const Usuario1 = await db.user.update({ token: token },
                    {
                        where: {
                            email: user_email
                        },
                    });
                mailService.enviar(Usuario, type_request, action_type, token);

                setTimeout(() => {
                    resetToken(user_email)
                }, 600000);
                res.status(200).json({
                    message: 'Envio exitoso'
                });
            } else {
                res.status(404).json({
                    error: 'No Existe Usuario en el sistema!'
                })
            }
        } else {
            res.status(404).json({
                error: 'Ingrese un Email Valido!'
            })
        }
    } catch (error) {
        res.status(500).send({
            message: '¡Error en el servidor!.'
        })
        next(error);
    }
};

exports.tokenv = async (req, res, next) => {
    try {
        const { token_user } = req.body;
        if (token_user) {   
            const Usuario = await db.user.findOne({ where: { token: token_user } });
            if (Usuario) {
                res.status(200).json({id:Usuario.id, name:Usuario.user_name});
            } else {
                res.status(404).json({
                    error: 'No Existe Usuario en el sistema!'
                })
            }
        } else {
            res.status(404).json({
                error: 'Ingrese un Token Valido!'
            })
        }
    } catch (error) {
        res.status(500).send({
            message: '¡Error en el servidor!.'
        })
        next(error);
    }
};

exports.passwd = async (req, res, next) => {
    try {
        const user_id  = req.body.user_id;
        const passwd_new = req.body.passwd_new;
        const passwd_compare = req.body.passwd_compare;
        if (user_id) {          
            const Usuario = await db.user.findOne({ where: { id: user_id } });
            if (Usuario) {
                if(passwd_new == passwd_compare){
                    const passwd_new2 = bcrypt.hashSync(passwd_new, 10);
                    const Usuario2 = db.user.update({password : passwd_new2},{
                        where:{
                            id: user_id
                        },
                    });
                    res.status(200).json({
                        message: 'Cambio Exitoso'
                    });
                }else{
                    res.status(404).json({
                        error: 'No coinciden las claves!'
                    })
                }                
            } else {
                res.status(404).json({
                    error: 'No Existe Usuario en el sistema!'
                })
            }
        } else {
            res.status(404).json({
                error: 'Ingrese un id valido!'
            })
        }
    } catch (error) {
        res.status(500).send({
            message: '¡Error en el servidor!.'
        })
        next(error);
    }
};

function resetToken(user_email) {
    try {
        const Usuario1 =  db.user.update({ token: "" },
            {
                where: {
                    email: user_email
                },
            });
    } catch (error) {
        res.status(500).send({
            message: '¡Error en el servidor!.'
        })
        next(error);
    }
}
