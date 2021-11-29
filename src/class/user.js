import db from '../database/database.js'

export const ADMIN = 'admin'
export const PROSUMER = 'prosumer'

export default class User {

    static table = 'user'
    static fields = [
        'type', 'name', 'forename', 'email', 'password', 'address',
        'additional_address', 'city', 'zip_code'
    ]

    constructor(type, name, forename, email, password, address, additionalAddress, city, zipCode) {
        this.type = type
        this.name = name
        this.forename = forename
        this.email = email
        this.password = password
        this.address = address
        this.additional_address = additionalAddress
        this.city = city
        this.zip_code = zipCode
    }

    isAdmin() {
        return this.type == ADMIN
    }

    async block(time) {
        let end = new Date(Date.now().valueOf() + time).toISOString().slice(0, 19).replace('T', ' ')
        return await db.query(`INSERT INTO block_user (user_id, end) VALUES (?, ?);`, [ this.id, end ])
    }

    serialize() {
        return {
            id: this.id,
            type: this.type,
            first_name: this.name,
            last_name: this.forename,
            email: this.email,
            address: this.address,
            additional_address: this.additional_address,
            city: this.city,
            zip_code: this.zip_code
        }
    }
}
