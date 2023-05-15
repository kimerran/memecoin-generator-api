import { ethers } from "ethers";

const verifyMessage = (message: string, signature: string) => {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered;
}

export {
    verifyMessage,
}