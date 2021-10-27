
async function main() {
    if (network.name === "hardhat") {
        console.warn(
            "You are deploying a contract to the Hardhat network which" +
            "will automatically be created and destroyed every time. Use the Hardhat" +
            "option --network localhost"
        )
    }


    const [deployer] = await ethers.getSigners();
    console.log(
        `Deploying contracts with the account:`,
        await deployer.getAddress()
        );

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const Token = await ethers.getContractFactory('Token');
    const token = await Token.deploy();
    console.log(`Token address: ${token.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit();
    })
