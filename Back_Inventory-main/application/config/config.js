module.exports = {
    "development": {
        "username": process.env.DB_DEV_USER,
        "password": process.env.DB_DEV_PASSWORD,
        "database": process.env.DB_DEV_NAME,
        "host": process.env.DB_DEV_HOST,
        "dialect": process.env.DB_DEV_DIALECT,
        "logging": false
    },
    "test": {
        "username": process.env.DB_QA_USER,
        "password": process.env.DB_QA_PASSWORD,
        "database": process.env.DB_QA_NAME,
        "host": process.env.DB_QA_HOST,
        "dialect": process.env.DB_QA_DIALECT,
        "storage": "dummy"
    },
    "production": {
        "username": process.env.DB_PROD_USER,
        "password": process.env.DB_PROD_PASSWORD,
        "database": process.env.DB_PROD_NAME,
        "host": process.env.DB_PROD_HOST,
        "dialect": process.env.DB_PROD_DIALECT,
        "storage": "dummy"
    }
}
