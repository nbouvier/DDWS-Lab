import mysql from 'mysql'
import config from './config.js'

const connection = mysql.createConnection(config)

// Query the database
export function query(sql, params = []) {
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
export async function create(cls, obj) {
    let fields = cls.fields.join(', ')
    let valuesMarks = cls.fields.map(v => '?').join(', ')
    let values = cls.fields.map(k => obj[k])

    // Need error handling to prevent concurrency
    let id = await nextID(cls.table)
    await query(`INSERT INTO ${cls.table} (id, ${fields}) VALUES (${id}, ${valuesMarks});`, values)
    obj.id = id

    return obj
}

// Update $obj in the database
export function update(cls, obj) {
    let fieldsName = cls.fields.map(v => `${v} = ?`).join(', ')
    let values = cls.fields.map(k => obj[k])

    return query(`UPDATE ${cls.table} SET ${fieldsName} WHERE id = ${obj.id};`, values)
}

// Load a $cls object from the database given its ID
export async function loadOne(cls, id) {
    let fields = cls.fields.join(', ')
    let dbObj = await query(`SELECT ${fields} FROM ${cls.table} WHERE id = ?;`, [id])

    if(!dbObj.length) { return false }
    else { dbObj = dbObj[0] }

    let args = cls.fields.map(k => dbObj[k])
    let obj = new (cls)(...args)
    obj.id = id

    return obj
}

// Load every $cls object from the database
export async function loadAll(cls) {
    let fields = `id, ${cls.fields.join(', ')}`
    let dbObjs = await query(`SELECT ${fields} FROM ${cls.table};`)

    let objs = []
    dbObjs.forEach(dbObj => {
        let args = cls.fields.map(k => dbObj[k])
        let obj = new (cls)(...args)
        obj.id = dbObj.id
        objs.push(obj)
    })

    return objs
}

// Load a $cls object from the database given $where as the WHERE condition
// Parameters of the WHERE condition should be escaped using a '?' and passed in the array $params
export async function loadWhere(cls, where, params) {
    let fields = `id, ${cls.fields.join(', ')}`
    let dbObjs = await query(`SELECT ${fields} FROM ${cls.table} WHERE ${where};`, params)

    let objs = []
    dbObjs.forEach(dbObj => {
        let args = cls.fields.map(k => dbObj[k])
        let obj = new (cls)(...args)
        obj.id = dbObj.id
        objs.push(obj)
    })

    return objs
}

// Load the ID of every $cls object from the database
// A WHERE condition can be given in the $where argument
// Parameters of the WHERE condition should be escaped using a '?' and passed in the array $params
export async function loadIDs(cls, where = '', params = []) {
    let sql = where ? `SELECT id FROM ${cls.table} WHERE ${where};` : `SELECT id FROM ${cls.table};`
    let objs = await query(sql, params)

    return objs.map(obj => obj.id)
}

// Delete a $cls object from the database given its ID
export function del(cls, id) {
    return query(`DELETE FROM ${cls.table} WHERE id = ?;`, [id])
}

const db = { query, create, update, loadOne, loadAll, loadWhere, loadIDs, del }

export default db
