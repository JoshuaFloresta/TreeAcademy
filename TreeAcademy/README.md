# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Test forms locally

1. Copy `.env.example` to a new `.env` file and enter the mail-service credentials. Do not commit `.env`.
2. For newsletter subscriptions, also set `RESEND_API_KEY` and `RESEND_FROM`. `RESEND_FROM` must use a sender domain verified in Resend.
3. Run `npm run dev`, then open the local address Vite shows (normally `http://localhost:5173`). This starts both Vite and the local API on port 3001. If you only start the client with `npm run dev:client`, newsletter subscriptions and other `/api/*` requests will fail because the backend is not running.
4. Complete an enrolment, draw a signature, and upload a PNG or JPG receipt. The completed agreement PDF, signature, receipt, and submitted details will be sent to `trainwithmastersonline@gmail.com`.

Vite proxies `/api/*` requests to the local API at port 3001, so no `VITE_PAYMENT_API_URL` value is needed for local testing.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
