# SocialStream Backend

Node.js/Express API with MongoDB for SocialStream.

## Setup

1. Create `.env` in this folder with:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

2. Install dependencies:

```bash
npm install
```

3. Seed the database (optional):

```bash
npm run seed
```

## Scripts

- `npm run dev` — Start with nodemon (auto-reload)
- `npm start` — Start production server
- `npm run seed` — Seed hero user (Safiullah)

## API

- `GET /api/health` — Health check (`{ status: "ok", message: "SocialStream Backend is pumping!" }`)
