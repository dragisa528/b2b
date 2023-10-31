# B2B Buyer Portal

A monorepo frontend application designed for the BigCommerce B2B Edition Buyer portal. It's built using Turborepo, TypeScript, and React.

## Index

- [Core Technologies](#-core-technologies)
- [Workspaces](#-workspaces)
- [Tools and Libraries](#-tools-and-libraries)
- [System Setup](#-system-setup)
- [Local Development](#-local-development)
- [Running Project Locally](#running-project-locally)
- [Contribution](#-contribution)
- [Contact & Support](#-contact--support)

## 🚀 Core Technologies

- **Monorepo Management:** Turborepo
- **Type System:** TypeScript
- **Frontend Library:** React 18
- **Build Tool:** Vite

## 📦 Workspaces

- **Application:** `/apps/storefront` - A next-gen B2B Edition storefront application.
  - You can run multiple apps concurrently via turborepo [tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks).
  
- **Packages:**
  - `/packages/eslint-config-b3` - Shared ESLint configurations.
  - `/packages/tsconfig` - Shared TypeScript configurations.
  - `/packages/ui` - A collection of UI components built by B3.
  - `/packages/store` - A collection of shared store logic.
  - `/packages/b3global` - A collection of shared global logic.

## 🛠 Tools and Libraries

- **Linting:** ESLint
- **Commit Standards:** commitlint
- **Git Workflow Tools:** Husky, lint-staged
- **UI Framework:** MUI 5
- **Routing:** React Router 6

## 🛠 System Setup

- **Node:** Ensure you have Node.js version >=18.0.0.
- **Package Manager:** This project uses Yarn v1.22.17.

## ⚙ Local Development 

1. Installation of Node and Yarn. 
   - For Node, we recommend using [nvm](https://github.com/nvm-sh/nvm).
   - Once Node is installed, you can install Yarn by using `npm i -g yarn`. If you'd rather use `pnpm`, visit this [guide](https://dev.to/andreychernykh/yarn-npm-to-pnpm-migration-guide-2n04).
2. Clone the repository.
3. Install dependencies using `yarn`.
4. Copy environment variables: `cp apps/storefront/.env-example apps/storefront/.env`.
5. Update the following values in `.env`:
  - `VITE_B2B_URL`: The URL of the B2B Edition API.
  - `VITE_B2B_SOCKET_URL`: The URL of the B2B Edition WebSocket API.
  - `VITE_TRANSLATION_SERVICE_URL`: The URL of the translation service API.
  - `VITE_CHANNEL_ID`: The ID of the channel to use for the storefront.
  - `VITE_STORE_HASH`: The hash of the store to use for the storefront.
  - `VITE_CATPCHA_SETKEY`: The reCAPTCHA site key (optional).
  - `VITE_B2B_CLIENT_ID`: The client ID of the BigCommerce App from the [developer portal](https://devtools.bigcommerce.com/).
  - `VITE_LOCAL_DEBUG`: Set to "FALSE". This is for connecting our local development with the B2B Edition GraphQL API.
6. Start the development server: `yarn RUN dev`.

## Running Project Locally

1. Activate store channel in the Channels Manager.
2. Configure header and footer scripts:

  - Navigate to Channels Manager -> Scripts.
  - Add two scripts (e.g., B2BEdition-header, B2BEdition-footer). Ensure you set the correct port for your localhost in the script URLs.
  - Edit the header script:

   ```html 
   <script>
       {{#if customer.id}}
       {{#contains page_type "account"}}
       var b2bHideBodyStyle = document.createElement('style');
       b2bHideBodyStyle.id = 'b2b-account-page-hide-body';
       b2bHideBodyStyle.innerHTML = 'body { display: none !important }';
       document.head.appendChild(b2bHideBodyStyle);
       {{/contains}}
       {{/if}}
   </script>
   <script type="module">
       import RefreshRuntime from "http://localhost:3001/@react-refresh"
       RefreshRuntime.injectIntoGlobalHook(window)
       window.$RefreshReg$ = () => {}
       window.$RefreshSig$ = () => (type) => type
       window.__vite_plugin_react_preamble_installed__ = true
   </script>
   <script type="module" src="http://localhost:3001/@vite/client"></script>
   <script type="module" src="http://localhost:3001/index.html?html-proxy&index=0.js"></script>
   ```
  - Edit the footer script:

   ```html
   <script type="module" src="http://localhost:3001/src/main.ts"></script>
   ```

3. Verify correct values in the .env file, especially the client_id for the draft app.

4. For local debugging, set VITE_LOCAL_DEBUG to false in .env.

5. Visit the storefront and attempt to sign in.

6. For cross-origin issues, update URL variables in .env to use the tunnel URL with HTTPS.

Note: If linters aren't functional, run `yarn prepare` first.

## 🤝 Contribution

For developers wishing to contribute, ensure all PRs meet the linting and commit message standards.

## 📞 Contact & Support

For queries, issues, or support, reach out to us at b2b@bigcommerce.com or open an issue in this repository.
