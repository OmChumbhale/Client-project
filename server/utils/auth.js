import crypto from 'crypto';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'stepwise123',
    secret: process.env.AUTH_SECRET || 'stepwise-local-secret',
  };
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload) {
  const { secret } = getAdminConfig();
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function verifyCredentials(username, password) {
  const adminConfig = getAdminConfig();
  return safeEqual(username, adminConfig.username) && safeEqual(password, adminConfig.password);
}

export function createAuthToken(username) {
  const payload = JSON.stringify({
    sub: username,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = signPayload(encodedPayload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authorization.slice('Bearer '.length);
  const payload = verifyAuthToken(token);

  if (!payload) {
    response.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    return;
  }

  request.user = { username: payload.sub };
  next();
}
