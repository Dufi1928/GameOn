import forge from 'node-forge';

export const Decrypter = async (encryptedMessage: string, privateKeyPem: string): Promise<string> => {
    try {
        console.log('Starting decryption process...');
        console.log('Converting private key to Forge format...');
        const privateKeyForge = forge.pki.privateKeyFromPem(privateKeyPem);
        console.log('Private key successfully converted to Forge format.');

        console.log('Decoding message from Base64...');
        const decodedMessage = atob(encryptedMessage);
        console.log('Message successfully decoded from Base64.');

        console.log('Decrypting message with RSA-OAEP...');
        const decryptedBytes = privateKeyForge.decrypt(decodedMessage, 'RSA-OAEP');
        console.log('Message successfully decrypted with RSA-OAEP.');

        console.log('Converting decrypted bytes to string...');
        const decryptedMessage = forge.util.decodeUtf8(decryptedBytes);
        console.log('Decrypted bytes successfully converted to string.');

        return decryptedMessage;
    } catch (error) {
        console.error('Error during decryption:', error);
        throw new Error('Failed to decrypt');
    }
};
