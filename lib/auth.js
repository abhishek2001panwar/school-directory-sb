import jwt from 'jsonwebtoken';
import { supabase } from './supabaseClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, verified')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) return null;
    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
