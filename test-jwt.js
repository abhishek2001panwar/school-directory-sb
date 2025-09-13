// Test JWT functionality
console.log('Testing JWT...');

// Test environment variables
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

// Test JWT creation and verification
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const testPayload = { userId: 1, email: 'test@example.com' };
const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '7d' });

console.log('Token created:', token);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.error('Token verification failed:', error);
}

console.log('JWT test complete.');
