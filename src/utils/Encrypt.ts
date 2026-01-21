const secret = process.env.REACT_APP_TEXT_ENCRYPTION_SECRET;

export const encryptText = (text: string): string => {
    if (!secret) return '';
    const halfLength = Math.floor(secret.length / 2);
    const firstHalf = secret.substring(0, halfLength);
    const secondHalf = secret.substring(halfLength);

    const newSecret = firstHalf + text + secondHalf;

    const encryptedToken = btoa(btoa(newSecret));

    return encryptedToken;
};
