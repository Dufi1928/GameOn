import forge from 'node-forge';

export const Decrypter = async (encryptedMessage: string, privateKeyPem: string): Promise<string> => {
    try {
        console.log('Starting decryption process...');
        // Convertir la clé privée en format PEM en une clé privée de forge
        console.log('Converting private key to Forge format...');
        const privateKeyForge = forge.pki.privateKeyFromPem(privateKeyPem);
        console.log('Private key successfully converted to Forge format.');

        // Décoder le message de base64 à bytes
        console.log('Decoding message from Base64...');
        const encryptedBytes = forge.util.decode64(encryptedMessage);
        console.log('Message successfully decoded from Base64.');

        // Décrypter le message avec RSA-OAEP
        console.log('Decrypting message with RSA-OAEP...');
        const decryptedBytes = privateKeyForge.decrypt(encryptedBytes);
        console.log('Message successfully decrypted with RSA-OAEP.');

        // Convertir les bytes déchiffrés en string
        console.log('Converting decrypted bytes to string...');
        const decryptedMessage = forge.util.decodeUtf8(decryptedBytes);
        console.log('Decrypted bytes successfully converted to string.');

        return decryptedMessage;
    } catch (error) {
        console.error('Error during decryption:', error);
        throw new Error('Failed to decrypt');
    }
};
