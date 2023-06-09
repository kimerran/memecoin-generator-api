require('dotenv').config();
import { ethers } from "ethers";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);

const eventSignature = 'ContractDeployed(string,string,string)'
const abi = [`event ${eventSignature}`]
let iface = new ethers.Interface(abi)

const filter = {
    topics: [
        ethers.id(eventSignature)
    ]
}

async function main() {
    provider.on(filter, async (x: any) => {
        try {
            let xy = iface.parseLog(x)
            // xy?.args
            console.log('[received] args', xy?.args)
            if (xy) {
                const coinId = xy?.args[2];

                const result = await prisma.coinInstance.update({
                    where: {
                        id: Number(coinId)
                    },
                    data: {
                        status: 'deploy_live'
                    }
                })
                console.log('update result', result);
            }
        } catch (error) {
            console.error(error)
        }
    })
}

main();
