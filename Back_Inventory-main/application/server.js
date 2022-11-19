const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const crPath = '/etc/nginx/ssl/inventario_scoutscentinelas113cali.org/inventario_scoutscentinelas113cali.crt';
const pkPath = '/etc/nginx/ssl/inventario_scoutscentinelas113cali.org/inventario_scoutscentinelas113cali.key';
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//Vars
let PORT;
process.env.NODE_ENV === 'production'
    ? (PORT = process.env.PROD_PORT) :
    process.env.NODE_ENV === 'test'
        ? (PORT = process.env.QA_PORT) :
        (PORT = process.env.DEV_PORT);

//instancia de express en app
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imagePath = path.join(__dirname, '/article_images_uploads');
        fs.mkdirSync(imagePath, { recursive: true });
        cb(null, imagePath);
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.split(".");
        cb(null, `${uuidv4()}.${originalname[1]}`);
    }
});

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
    next();
});

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Private-Network: true');
        next();
    });
};

// settings
/*app.set('port', process.env.PROD_PORT || 3002);
app.set('portdevelopment', process.env.DEV_PORT || 3001);
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage }).single('files'));

//Archivos estaticos
app.use('/static', express.static(path.join(__dirname, '/article_images_uploads')));

//routes
app.use('/api', apiRouter);

// start sever
if (fs.existsSync(crPath) && fs.existsSync(pkPath) && process.env.NODE_ENV === 'production') {
    https.createServer({
        cert: fs.readFileSync(crPath),
        key: fs.readFileSync(pkPath)
    }, app).listen(PORT, (error) => {
        if (!error) {
            console.log(`Running in ${process.env.NODE_ENV}`);
            console.log(`Server on port http://localhost:${PORT} with SSH`);
        } else {
            console.log(error);
        }
    });
}
else {
    app.listen(PORT, (error) => {
        if (!error) {
            console.log(`Running in ${process.env.NODE_ENV}`);
            console.log(`Server on port http://localhost:${PORT}`);
        } else {
            console.log(error);
        }
    });
}

module.exports = app;
