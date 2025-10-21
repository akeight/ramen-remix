import pg from 'pg'
import './dotenv.js'

// Enable SSL when connecting to remote DBs by default, but allow disabling via PGSSLMODE=disable.
// Treat localhost/127.0.0.1 as local (no SSL) unless PGSSLMODE explicitly requests SSL.
const envSSL = process.env.PGSSLMODE
const host = process.env.PGHOST || ''
const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === ''
const useSSL = (envSSL && envSSL !== 'disable') || (!isLocalHost && !envSSL)

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: host,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: useSSL ? { rejectUnauthorized: false } : false
}

export const pool = new pg.Pool(config)