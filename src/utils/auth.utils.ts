import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';

// Q. bcrypt is used in user model for password hashing and comparison. Why not here?
// A. bcrypt is specifically designed for hashing passwords securely. For refresh tokens, 
// which are not passwords but rather random strings used for session management, a 
// cryptographic hash function like SHA-256 (via crypto) is sufficient and more efficient.
// Q. Why cryptographic hash function are sufficient for refresh tokens?
// A. Refresh tokens are typically long, random strings that are hard to guess. 
// The primary purpose of hashing them is to prevent misuse if the database is compromised. 
// Since they are not user-chosen secrets like passwords, using a fast hash function like SHA-256 
// is adequate for security while being more performant than bcrypt.

export const generateAccessToken = (userId: string): string => {
  const secret = config.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment');
  }

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN || '15m' } as jwt.SignOptions
  );
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyAccessToken = (token: string): any => {
  const secret = config.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, secret);
};