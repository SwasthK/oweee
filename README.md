# Oweee

Track money you lend to friends. Log a loan, record partial repayments, keep an audit trail, and share a read-only link that does not require an account.

## Local setup

Requires [Bun](https://bun.sh) and PostgreSQL.

```bash
bun install
cp .env.example .env
```

Create the `oweee` database, then push the schema and start the app:

```bash
bun run db:push
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` and fill in real values. Do not commit `.env`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Session signing secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Public origin Better Auth uses for callbacks |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL used in metadata and share links |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

`BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be the same origin the browser uses. Locally that is `http://localhost:3000`.

In the Google Cloud OAuth client, add:

- Authorized JavaScript origin: the site origin
- Authorized redirect URI: `{origin}/api/auth/callback/google`

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript |
| `bun run db:push` | Push the Drizzle schema to the database |
| `bun run db:generate` | Generate a SQL migration from the schema |
| `bun run db:migrate` | Apply committed migrations |
| `bun run db:studio` | Open Drizzle Studio |
