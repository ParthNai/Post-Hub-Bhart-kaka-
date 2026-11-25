import * as crypto from 'crypto';

type ENCDEC = {
  text: string;
  secretKey: string;
  iv: string;
};

export function encrypt({ text, iv, secretKey }: ENCDEC) {
  const ivText = Buffer.from(iv, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, ivText);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypting text
export function decrypt({ text, iv, secretKey }: ENCDEC) {
  let ivText = Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey),
    ivText,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
