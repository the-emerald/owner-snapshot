import "ethers";
import { ethers } from "ethers";
import { writeFileSync } from "fs";

const TOKEN_ADDRESS = "0x8184a482A5038B124d933B779E0Ea6e0fb72F54E";
const API_KEY = "your_api_key_here";
const BLOCK = 15136222;
const SUPPLY = 5;

async function main() {
    let map = new Map<number, string>;

    let provider = new ethers.providers.AlchemyProvider(
        "homestead",
        API_KEY
    );

    let contract = new ethers.Contract(
        TOKEN_ADDRESS,
        ["function ownerOf(uint256 id) view returns (address)"],
        provider
    );

    for (let i = 0; i < SUPPLY; i++) {
        try {
            console.log("fetching", i);
            const owner = await contract.ownerOf(i, {
                blockTag: BLOCK
            });
            map.set(i, owner);
        }
        catch (e) {
            console.log("errored with", i);
        }
    }

    writeFileSync("output.json", JSON.stringify(Object.fromEntries(map), null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
