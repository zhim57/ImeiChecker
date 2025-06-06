# IMEI Checker

A Node.js and Express application for looking up mobile device information by IMEI and storing query history in MongoDB.

## Prerequisites

- Node.js 14 or later
- A MongoDB database
- An API token from [imeidb.xyz](https://imeidb.xyz)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` in the project root and update the values:
   ```ini
   MONGODB_URI=<your MongoDB connection string>
   IMEI_API_TOKEN=<token from imeidb.xyz>
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3002` by default.

## Usage

- Visit `http://localhost:3002` in your browser to search IMEI numbers.
- `GET /api/imei1F/:imei` returns stored IMEI information and fetches from the external API if not present.
- `GET /result1/:imei` performs a direct lookup using your API token.
- Additional routes under `/api/imeis` expose logged requests.

## Scripts

- `npm start` – run the application.
- `npm run watch` – start with nodemon for development.
- `npm run seed` – populate the database with sample data.
- `npm test` – run the Jest test suite.

## Environment Variables

- **MONGODB_URI** – MongoDB connection URI used by the server.
- **IMEI_API_TOKEN** – Authentication token for imeidb.xyz API requests.

See `.env.example` for the full set of variables required by the application.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

