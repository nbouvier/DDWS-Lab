import crypto from 'crypto'

export function encrypt(password, algorithm = 'sha256', digest = 'hex', carType = 'utf8') {
    return crypto.createHash(algorithm).update(password, carType).digest(digest)
}

export function compare(password, cryptedPassword, algorithm = 'sha256', digest = 'hex', carType = 'utf8') {
    return crypto.createHash(algorithm).update(password, carType).digest(digest) == cryptedPassword
}

const crypt = { encrypt, compare }

export default crypt
