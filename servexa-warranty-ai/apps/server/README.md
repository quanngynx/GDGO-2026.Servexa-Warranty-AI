# Server

## Setup env

### Use infisical to inject secrets

- Install by using winget

```bash
winget install infisical
```

- For other installation, check at <https://infisical.com/docs/cli/overview#installation>

- Setup env in infisical

- Login

```bash
infisical login
```

- Run app with infisical

```bash
infisical run --env=dev -- pnpm dev
```
