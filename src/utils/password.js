import crypto from 'crypto';

const ITERATIONS = 120000; // OWASP recommended range
const KEYLEN = 64;
const DIGEST = 'sha512';

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = ITERATIONS;
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, KEYLEN, DIGEST, (err, key) => {
      if (err) reject(err); else resolve(key.toString('hex'));
    });
  });
  return `pbkdf2$${iterations}$${salt}$${derivedKey}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [scheme, iterStr, salt, hash] = stored.split('$');
    if (scheme !== 'pbkdf2') return false;
    const iterations = parseInt(iterStr, 10) || ITERATIONS;
    const derivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, KEYLEN, DIGEST, (err, key) => {
        if (err) reject(err); else resolve(key.toString('hex'));
      });
    });
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derivedKey, 'hex'));
  } catch (e) {
    return false;
  }
}
