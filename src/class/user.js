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

    serialize() {
        return {
            type: this.type,
            name: this.name,
            forename: this.forename,
            email: this.email,
            address: this.address,
            additional_address: this.additional_address,
            city: this.city,
            zip_code: this.zip_code
        }
    }
}
