import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-hackathon'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  console.log('Generating token for user:', userId, 'with JWT_SECRET:', JWT_SECRET ? 'Present' : 'Missing')
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  console.log('Generated token:', token.substring(0, 20) + '...')
  return token
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    console.log('Verifying token with JWT_SECRET:', JWT_SECRET ? 'Present' : 'Missing')
    const result = jwt.verify(token, JWT_SECRET) as { userId: string }
    console.log('Token verification successful:', result)
    return result
  } catch (error) {
    console.log('Token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    console.log('No token found in request')
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    console.log('Token verification failed for token:', token.substring(0, 20) + '...')
    return null
  }
  
  console.log('User authenticated successfully:', payload.userId)
  return payload.userId
}
