import { Account, CoinInstance } from "@prisma/client";
import { AppConfig } from "../env-config/lib";

import ERC20_METADATA from '../../contracts/MemeCoin.json';
import { ethers } from "ethers";

function toWei(ethValue: string) {
    return ethers.parseEther(ethValue)
}
const contractDeploy = async (appConfig: AppConfig, coinContract: CoinInstance, owner: Account) => {

    const provider = new ethers.JsonRpcProvider(appConfig.evm.rpcUrl);
    const wallet = new ethers.Wallet(appConfig.evm.deployerPrivateKey, provider);

    const factory = new ethers.ContractFactory(
        ERC20_METADATA.abi,
        ERC20_METADATA.bytecode,
        wallet
    );

    const contractTx = await factory.deploy(
        coinContract.name,
        coinContract.symbol,
        coinContract.id.toString(),
        toWei(coinContract.supplyInEth),
        owner.walletAddress,
        {}
    );
    return {
        contractAddress: contractTx.target.toString()
    }
}

export {
    contractDeploy,
}