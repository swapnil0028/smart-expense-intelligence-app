import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const COOKIE_NAME = 'authToken'

export default async function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.userId).select('-__v -password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
