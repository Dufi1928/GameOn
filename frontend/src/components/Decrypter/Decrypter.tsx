// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import forge from 'node-forge';

export const Decrypter = async (encryptedMessage: string, privateKeyPem: string): Promise<string> => {
    try {
        const privateKeyForge = forge.pki.privateKeyFromPem(privateKeyPem);

        const decodedMessage = atob(encryptedMessage);

        const decryptedBytes = privateKeyForge.decrypt(
            decodedMessage,
            'RSA-OAEP',
            {
                md: forge.md.sha256.create(),
                mgf1: {
                    md: forge.md.sha256.create(),
                },
            }
        );

        return forge.util.decodeUtf8(decryptedBytes);
    } catch (error) {
        throw new Error('Failed to decrypt');
    }
};
