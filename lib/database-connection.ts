import { Pool, PoolClient, QueryResult } from 'pg'

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ekraf_jabar',
  user: process.env.DB_USER || 'erlan',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Query helper function
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', { text, params, error })
    throw error
  }
}

// Get a client from the pool for transactions
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect()
  return client
}

// Transaction helper
export const transaction = async (callback: (client: PoolClient) => Promise<void>) => {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    await callback(client)
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1')
    return true
  } catch (error) {
    console.error('Database health check failed', error)
    return false
  }
}

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  await pool.end()
  console.log('Database pool closed')
}

export default pool