import bcrypt from 'bcrypt'
import { query } from './database-connection'

export interface User {
  id: number
  email: string
  name?: string
  created_at: Date
  updated_at: Date
}

export interface CreateUserInput {
  email: string
  password: string
  name?: string
}

export class UserService {
  // Create a new user
  async createUser(input: CreateUserInput): Promise<User> {
    const { email, password, name } = input

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert user
    const result = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at, updated_at',
      [email, password_hash, name || null]
    )

    return result.rows[0]
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE email = $1',
      [email]
    )

    return result.rows.length > 0 ? result.rows[0] : null
  }

  // Find user by ID
  async findUserById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )

    return result.rows.length > 0 ? result.rows[0] : null
  }

  // Update user
  async updateUser(id: number, updates: Partial<Pick<User, 'name'>>): Promise<User> {
    const { name } = updates

    const result = await query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, created_at, updated_at',
      [name, id]
    )

    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    return result.rows[0]
  }

  // Change password
  async changePassword(id: number, newPassword: string): Promise<void> {
    const password_hash = await bcrypt.hash(newPassword, 10)

    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [password_hash, id]
    )
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id])
  }
}

export const userService = new UserService()