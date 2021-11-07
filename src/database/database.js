const mysql = require('mysql')
const config = require('./config')

const connection = mysql.createConnection(config.config)

exports.query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results, fields) => {
            return err ? reject(err) : resolve(results)
        })
    })
}
