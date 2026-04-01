const crypto = require("crypto");

// Secret key - in production move this to .env
const SECRET_KEY = "scantrust_secret_key_2024";

/**
 * Generates a secure HMAC-signed token for a product
 * Format: uuid.hmac_signature
 * The UUID is the raw token, HMAC ensures it cant be forged
 */
function generateToken(productId) {
  const rawToken = crypto.randomUUID();
  const hmac = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(productId + rawToken)
    .digest("hex");

  // Final token = rawToken.hmac (dot separated)
  return `${rawToken}.${hmac}`;
}

/**
 * Verifies that a token's HMAC signature matches
 * This ensures the token wasnt tampered with or forged
 */
function verifyTokenSignature(token, productId) {
  const [rawToken, receivedHmac] = token.split(".");
  if (!rawToken || !receivedHmac) return false;

  const expectedHmac = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(productId + rawToken)
    .digest("hex");

  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedHmac, "hex"),
      Buffer.from(expectedHmac, "hex")
    );
  } catch {
    return false;
  }
}

module.exports = { generateToken, verifyTokenSignature };