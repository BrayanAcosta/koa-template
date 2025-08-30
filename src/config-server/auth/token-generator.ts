import jwt from 'jsonwebtoken'

const SECRET_KEY = String(process?.env?.JWT_SECRET_KEY)

export function crearToken (payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1m' })
}

export function verifyToken (token: string) {
  return jwt.verify(token, SECRET_KEY)
}
