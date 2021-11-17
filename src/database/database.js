const mysql = require('mysql')
const config = require('./config')

const types = {
    STRING: "string",
    NUMBER: "number",
    DATE: "date"
}

const connection = mysql.createConnection(config.config)

// Query the database
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results, fields) => {
            return err ? reject(err) : resolve(results)
        })
    })
}

// Retrieve the next available ID in $table
async function nextID(table) {
    return (await query(`SELECT AUTO_INCREMENT AS id FROM information_schema.tables WHERE table_name = '${table}' AND table_schema = DATABASE();`))[0].id
}

// Create $obj in the database and gives it an ID
async function create(cls, obj) {
    fields = cls.fields.map(field => field.name).join(", ")
    values = []
    cls.fields.forEach((field, i) => {
        values[i] = obj[field.name]
    });
    valuesMarks = values.map(v => '?').join(", ")

    // Need error handling to prevent concurrency
    id = await nextID(cls.table)
    await query(`INSERT INTO ${cls.table} (id, ${fields}) VALUES (${id}, ${valuesMarks});`, values)
    obj.id = id

    return obj
}

// Update $obj in the database
function update(cls, obj) {
    fieldsName = []
    values = []
    cls.fields.forEach((field, i) => {
        fieldsName[i] = `${field.name} = ?`
        values[i] = obj[field.name]
    });
    fieldsName = fieldsName.join(", ")

    return query(`UPDATE ${cls.table} SET ${fieldsName} WHERE id = ${obj.id};`, values)
}

// Load a $cls object from the database given its ID
async function load(cls, id) {
    fields = cls.fields.map(field => field.name).join(", ")
    dbObj = (await query(`SELECT ${fields} FROM ${cls.table} WHERE id = ?;`, [id]))[0]

    params = []
    cls.fields.forEach((param, i) => {
        params[i] = dbObj[param.name]
    });

    obj = new (cls)(...params)
    obj.id = id

    return obj
}

// Load a $cls object from the database given $where as the WHERE condition
// Parameters of the WHERE condition should be escaped using a "?" and passed in the array $params
async function advancedLoad(cls, where, params) {
    fields = cls.fields.map(field => field.name).join(", ")
    dbObj = (await query(`SELECT ${fields} FROM ${cls.table} WHERE ${where};`, params))[0]

    params = []
    cls.fields.forEach((param, i) => {
        params[i] = dbObj[param.name]
    });

    obj = new (cls)(...params)
    obj.id = id

    return obj
}

// Load the ID of every $cls object from the database
// A WHERE condition can be given in the $where argument
// Parameters of the WHERE condition should be escaped using a "?" and passed in the array $params
async function loadIDs(cls, where = "", params = []) {
    sql = where ? `SELECT id FROM ${cls.table} WHERE ${where};` : `SELECT id FROM ${cls.table};`
    objs = await query(sql, params)

    return objs.map(obj => obj.id)
}

// Delete a $cls object from the database given its ID
function del(cls, id) {
    return query(`DELETE FROM ${cls.table} WHERE id = ?;`, [id])
}

exports.types = types
exports.query = query
exports.create = create
exports.update = update
exports.load = load
exports.advancedLoad = advancedLoad
exports.loadIDs = loadIDs
exports.del = del
