# Correx

## Developing

Create an `.env` file containing the following:

```
DATABASE_URL=postgres://dev:dev@localhost/correx
POSTGRES_PASSWORD=dev
POSTGRES_USER=dev
POSTGRES_DB=correx
VITE_JWT_SECRET_KEY=123
VITE_TWITTER_API_KEY=<twitter-api-key>
VITE_TWITTER_API_SECRET=<twitter-api-key-secret>
VITE_TWITTER_CALLBACK_URI=http://dev.localhost:3000/api/auth/twitter/callback
VITE_REDDIT_API_KEY=<reddit-api-key>
VITE_REDDIT_API_SECRET=<reddit-api-key-secret>
VITE_REDDIT_CALLBACK_URI=http://dev.localhost:3000/api/auth/reddit/callback
VITE_OAUTH_PROTOTCOL=http
VITE_BASE_URL=http://dev.localhost:3000
```

Start the database:
```
make db
```

Start a development shell:
```
make shell
```

Install dependencies:

```
npm i
```

Create the database:

```
make db
```

### Once in the development shell

Migrate the database:

```
make db-migrate
```

Start the dev server:

```
npm run dev
```

You should now be able to load Correx by going to `http://dev.localhost:3000`. You can signup but won't be able to sign in until you mark your user as an admin in the database.

From your host, not the development shell:

```
make db-shell`
```

Mark your user as admin:
```
update users set admin = true where email = `<youremail>`;
```

You should now be able to sign in using your email and password.


## Contributing

Anyone is welcome to contribute and all contributions are valued.

Getting Started:

- Check issues labeled with `good-first-issue`.
- Open a PR with your contribution making sure to mention it in the description.
- Ensure tests are passing.
- Engage in any feedback on your PR. We'll be constructive and so should you.
