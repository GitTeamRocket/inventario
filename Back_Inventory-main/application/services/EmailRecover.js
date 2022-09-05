require('dotenv').config();
const path = require('path');
const db = require('../models');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { getMaxListeners } = require('process');

exports.enviar = async (user, request_type, action_type, token, next) => {

    try {
        const templatetosend = buildEmail(user.user_name, request_type, action_type, token);

        
        console.log("AQUI")
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.html',
                partialsDir: path.resolve('./views/main'),
                defaultLayout: false
            },
            viewPath: './views/',
            extName: '.html'
        }));

        let mailOptions = {
            from: process.env.suescumperea,
            to: user.email,
            subject: 'Cambio de Contraseña',
            html: templatetosend
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log('Error Occurs', err);
            }
            else {
                console.log('Email sent!!');
            }
        });
    } catch (error) {
        res.status(500).send({
            message: '¡Error en el servidor!.'
        });
        next(error);
    }
}

function buildEmail(name, request_type, action_type, token) {
    let HTML = HEADER + TITLE_P1

    if (request_type == 'New Password') {
        HTML = HTML + NEW_PASSWORD
    } else {
        HTML = HTML + RETURNING_TITLE
    }

    HTML = HTML + TITLE_P2 + MESSAGE_P1
    HTML = HTML + greeting(name) + message(request_type, action_type, token)
    HTML = HTML + MESSAGE_P2 + FOOTER

    return HTML
}

const HEADER =
    '<!-- HEAD --><!DOCTYPE html><html><head>  <title></title>  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  <meta name="viewport" content="width=device-width, initial-scale=1">  <meta http-equiv="X-UA-Compatible" content="IE=edge" />  <style type="text/css">    /* CLIENT-SPECIFIC STYLES */    body,    table,    td,    a {      -webkit-text-size-adjust: 100%;      -ms-text-size-adjust: 100%;    }    table,    td {      mso-table-lspace: 0pt;      mso-table-rspace: 0pt;    }    img {      -ms-interpolation-mode: bicubic;    }    /* RESET STYLES */    img {      border: 0;      height: auto;      line-height: 100%;      outline: none;      text-decoration: none;    }    table {      border-collapse: collapse !important;    }    body {      height: 100% !important;      margin: 0 !important;      padding: 0 !important;      width: 100% !important;    }    /* iOS BLUE LINKS */    a[x-apple-data-detectors] {      color: inherit !important;      text-decoration: none !important;      font-size: inherit !important;      font-family: inherit !important;      font-weight: inherit !important;      line-height: inherit !important;    }    /* MOBILE STYLES */    @media screen and (max-width:600px) {      h1 {        font-size: 32px !important;        line-height: 32px !important;      }    }    /* ANDROID CENTER FIX */    div[style*="margin: 16px 0;"] {      margin: 0 !important;    }  </style></head><body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">  <table border="0" cellpadding="0" cellspacing="0" width="100%">    <!-- LOGO -->    <tr>      <td bgcolor="#B31D1D" align="center">        <!--[if (gte mso 9)|(IE)]>            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">            <tr>            <td align="center" valign="top" width="600">            <![endif]-->        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">          <tr>            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">              <h2                style="font-size: 32px; font-weight: 400; margin: 0; font-family: Helvetica, Arial, sans-serif; color: #ffffff;">                Grupo Scout Centinelas 113</h2>            </td>          </tr>        </table>        <!--[if (gte mso 9)|(IE)]>            </td>            </tr>            </table>            <![endif]-->      </td>    </tr>'
const TITLE_P1 =
    '<!-- TITLE P1 -->    <tr>      <td bgcolor="#B31D1D" align="center" style="padding: 0px 10px 0px 10px;">        <!--[if (gte mso 9)|(IE)]>            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">            <tr>            <td align="center" valign="top" width="600">            <![endif]-->        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">          <tr>            <td bgcolor="#ffffff" align="center" valign="top"              style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">'
const TITLE_P2 =
    '<!-- TITLE P2 -->            </td>          </tr>        </table>        <!--[if (gte mso 9)|(IE)]>            </td>            </tr>            </table>            <![endif]-->      </td>    </tr>'

const NEW_PASSWORD =
    '<h1 style="font-size: 40px; font-weight: 400; margin: 0;">&iexcl;Nueva actualizaci&oacute;n de Cambio de contraseña!</h1>'
const RETURNING_TITLE =
    '<h1 style="font-size: 40px; font-weight: 400; margin: 0;">&iexcl;Nueva actualizaci&oacute;n de solicitud de devoluci&oacute;n!</h1>'

function greeting(name) {
    name = name.toLowerCase()
    let array = name.split(' ')

    let first_name =
        array[0].charAt(0).toUpperCase() + array[0].slice(1, array[0].length)

    return (
        '<!-- GREETING --><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 10px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">Hola ' +
        first_name +
        ',</p></td></tr>'
    )
}

const MESSAGE_P1 =
    '<!-- MESSAGE P1 -->    <tr>      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">        <!--[if (gte mso 9)|(IE)]>            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">            <tr>            <td align="center" valign="top" width="600">            <![endif]-->        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">'
const MESSAGE_P2 =
    '<!-- MESSAGE P2 --><tr><td bgcolor="#ffffff" align="left" style="padding: 10px 30px 20px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 400; line-height: 20px;"><p style="margin: 0;">* Recuerda que este mensaje es una notificaci&oacute;n y no debes responderlo. Si crees que te ha llegado por error, por favor comun&iacute;cate con el administrador de la aplicaci&oacute;n.</p></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr>'

const NEW_PASSWORD_CREATION_MESSAGE =
    '<!-- M2 --><tr><td bgcolor="#ffffff" align="left" style="padding: 10px 30px 30px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">Por favor dir&iacute;gete a la aplicaci&oacute;n de inventario para actualizar tu contraseña.</p></td></tr>'

function message(request_type, action_type, token) {
    let message_start =
        '<!-- M1 --><tr><td bgcolor="#ffffff" align="left" style="padding: 10px 30px 10px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;">Te estamos contactando desde la aplicaci&oacute;n de inventario para notificarte que '
    let message_end = 'este es el token que debes ingresar en la pagina para cambiar tu contraseña: ' + '\n' + token  + '.</p></td></tr>'

    return message_start + message_end + NEW_PASSWORD_CREATION_MESSAGE


    
}

const FOOTER =
    '<!-- FOOTER -->    <tr>      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">        <!--[if (gte mso 9)|(IE)]>            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">            <tr>            <td align="center" valign="top" width="600">            <![endif]-->        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">          <!-- HEADLINE -->          <tr>            <td bgcolor="#111111" align="center"              style="padding: 40px 30px 40px 30px; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">              <img width="50%" style="max-width: 300px;" src="https://i.ibb.co/K7p86K5/logo-nombre-white.png"                alt="logo-nombre-white" />            </td>          </tr>        </table>        <!--[if (gte mso 9)|(IE)]>            </td>            </tr>            </table>            <![endif]-->      </td>    </tr>    <!-- SUPPORT CALLOUT -->    <tr>      <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">        <!--[if (gte mso 9)|(IE)]>            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">            <tr>            <td align="center" valign="top" width="600">            <![endif]-->      </td>    </tr>  </table></body></html>'
