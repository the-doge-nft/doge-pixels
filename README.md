
# 🐕 Pupper Pixel Portal

> fungies 🤝 non-fungies

# 🏃️ Run-it

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone it like u own it:

```bash
git clone https://github.com/calebcarithers/dog.git
cd dog
```

> install and start your 👷⛓‍ Hardhat chain:

```bash
yarn install
yarn chain
```
> in a second terminal window, 🛰 deploy your contract:

```bash
yarn deploy
```

> after the deployment finishes, start your ✨ frontend there:

```bash
yarn start
```

> send some ETH to an account
```bash
yarn fund-account -amount <amount> -to <receiver_address>
```

🔏 Checkout the contracts in packages/hardhat/contract/token/PX (DOG20.sol & PX.sol)

📝 Peep the frontend at `App.tsx` in `packages/react-app/src`

💼 Edit the deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

