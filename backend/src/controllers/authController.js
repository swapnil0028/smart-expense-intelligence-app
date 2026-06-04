import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const JWT_EXPIRES_IN = '7d'
const COOKIE_NAME = 'authToken'

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    const token = signToken(user._id)

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (error) {
    console.error('register error:', error)
    return res.status(500).json({ message: 'Failed to register user' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user._id)
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token })
  } catch (error) {
    console.error('login error:', error)
    return res.status(500).json({ message: 'Failed to login' })
  }
}

export function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  res.json({ user: req.user })
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  res.json({ message: 'Logged out successfully' })
}
