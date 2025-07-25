import "server-only";

import crypto from "crypto";

const ALG = "aes-256-cbc" as const; // key length is 32 bytes
// openssl rand -hex 32

export const symmtericEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY not found");

  const iv = crypto.randomBytes(16); // initialization vector
  const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmtericDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY not found");

  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift() || "", "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
