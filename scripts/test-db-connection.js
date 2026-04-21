import { Pool } from 'pg'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

/**
 * Test database connection and setup
 * Usage: node scripts/test-db-connection.js
 */

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    console.log(`Host: ${process.env.DB_HOST}`)
    console.log(`Database: ${process.env.DB_NAME}`)
    console.log(`User: ${process.env.DB_USER}`)
    console.log('')

    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time')
    console.log('✅ Database connection successful!')
    console.log(`Server time: ${result.rows[0].current_time}`)
    console.log('')

    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      )
    `)

    if (tableCheck.rows[0].exists) {
      console.log('✅ Users table exists')

      // Count users
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users')
      console.log(`Total users: ${userCount.rows[0].count}`)
    } else {
      console.log('❌ Users table does not exist')
      console.log('Run ./scripts/migrate.sh to create it')
    }

    console.log('')
    console.log('Database setup test completed!')

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Please check your .env.local configuration')
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()