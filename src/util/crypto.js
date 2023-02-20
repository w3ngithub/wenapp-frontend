import crypto from 'crypto-js'

export const decrypt = (cipherText, secretKey) => {
  if (!cipherText) {
    return undefined
  }
  // Decrypt
  const bytes = crypto.AES.decrypt(cipherText, secretKey)
  const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8))
  return decryptedData
}
