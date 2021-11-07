exports.config = {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ddws',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || '',
    dateStrings: true
}
