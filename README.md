# Altura Frontend Test (Tauri)

This is a ethereum wallet using <strong>Tauri + Vite + React + TailwindCSS + PostCSS</strong>

## How to setup and run the proejct

- First, follow the instructions in [Tauri docs for basic environment setup](https://tauri.app/v1/guides/getting-started/prerequisites) depending on your device.
- Run `npm install` in the product root folder.
- Run `cargo update` in the `src-tauri` folder to install rust dependencies.
- Finally, run `npm run tauri dev` in the product root folder to run the project on local.

#### I deployed a ALUX test token on Sepolia Ethereum Testnet to test wallet

To change the token you can simply update token address from the `.env` file

```env
VITE_TOKEN_ADDRESS="{YOUR TOKEN ADDRESS}"
```

You can also update infura API KEY in the `.env` file.

```env
VITE_INFURA_KEY="{YOUR INFURA API KEY}"
```

## Wallet Features

- Create wallet <br />
  The wallet generates the 12 words mnemonic phase on wallet creation and have fields set password to encrypt the mnemonic phase.
- Import wallet <br />
  The users can import their wallet using 12 words mnemonic phase. They are also prompted to set password to encrypt mnemonic phase.
- Securely store encrypted mnemonic phase on app itself. <br />
  The app uses Tauri Plugin Store to store encrypted mnemonic phase
- Login<br />
  The users can login using the password and this password is used to decrypt to encrypted mnemonic phase.
- Fetch token balance from blockchain network
- Refresh token balance
- Show mnemonic phase if users enter their password
