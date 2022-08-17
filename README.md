# Correx

## Developing

Create an `.env` file containing the following:

```
DATABASE_URL=postgres://dev:dev@localhost/correx
POSTGRES_PASSWORD=dev
POSTGRES_USER=dev
POSTGRES_DB=correx
VITE_JWT_SECRET_KEY=
VITE_TWITTER_CALLBACK_URI=http://dev.localhost:3000/api/auth/callback/twitterV2
VITE_TWITTER_API_KEY=
VITE_TWITTER_API_SECRET=
VITE_REDDIT_API_KEY=
VITE_REDDIT_API_SECRET=
VITE_OAUTH_PROTOTCOL=http
VITE_BASE_URL=http://dev.localhost:3000

```

Create the database:

```
make db
```

Migrate the database:

```
make db-migrate
```

Start the dev server:

```
npm run dev
```
