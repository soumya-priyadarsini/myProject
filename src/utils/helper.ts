export const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);
export const doTimeout = (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000));