import bcrypt from 'bcrypt'

/**
 * Generate a bcrypt hash for a given password
 * Usage: node scripts/generate-password-hash.js <password>
 */
const password = process.argv[2] || 'your_password_here'

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, 10)
    console.log(`Password: ${password}`)
    console.log(`Hash: ${hash}`)
    console.log('\nYou can use this hash in the SQL migration or directly in the database.')
  } catch (error) {
    console.error('Error generating hash:', error)
    process.exit(1)
  }
}

generateHash()