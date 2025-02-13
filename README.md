# Unknown Project

Submitted to Safe Agentathon 2025.

Targetted Tracks:

- DeFAI
- Treasury

## Architecture

![architecture](./docs/images/architecture.png)

- app: web app, desktop ui
- core: chainsmith core
- agent: agent code built on top of ElizaOS framework

## Feature List

## Setup

- Node 23. Please check `nvm use 23` to avoid startup error
- `bun install` at root
- Go to each package and setup the environment variables file (.env)

```
cp .env.example .env
```

- To start server: `bun start:server`
- To start front-end app: `bun start:app`
- To start agent: `bun start:agent`
