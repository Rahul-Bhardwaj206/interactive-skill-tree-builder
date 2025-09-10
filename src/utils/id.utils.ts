/**
 *  Generated a unique ID using the Web Crypto API,
 *  or fallback to a random string method. This ensures IDs are unique across
 *  different components and avoids collisions.
 *  @returns {string} A unique identifier string.
 */

export function generateId(): string {
  // Use crypto.randomUUID if available (modern browsers and Node.js)
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
