const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const crPath = '/etc/letsencrypt/live/inventario.scoutscentinelas113cali.org/cert.pem';
const pkPath = '/etc/letsencrypt/live/inventario.scoutscentinelas113cali.org/privkey.pem';
const multer = require('multer');
const path = require('path');

//instancia de express en app
const app = express();
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '/article_images_uploads'));
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.originalname}-${uniqueSuffix}`);
    }
});

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
    next();
});

// settings
app.set('port', process.env.PORT || 3002);
app.set('portdevelopment', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({storage}).single('files'));

//Archivos estaticos
app.use('/static', express.static(path.join(__dirname, '/article_images_uploads')));

//routes
app.use('/api', apiRouter);

// start sever
if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
    https.createServer({
        cert: fs.readFileSync(crPath),
        key: fs.readFileSync(pkPath)
    },app).listen(app.get('port'), (error) => {
            if (!error) {
                console.log('Running encrypted');
                console.log(`Server on port http://localhost:${app.get('port')}`);
            } else {
                console.log(error);
            }
    });
}
else {
    app.listen(app.get('portdevelopment'), (error) => {
        if (!error) {
            console.log('Running in development');
            console.log(`Server on port http://localhost:${app.get('portdevelopment')}`);
        } else {
            console.log(error);
        }
    });
}

module.exports = app;
