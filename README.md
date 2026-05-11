# Discogs Collection Viewer

A SvelteKit app to display your Discogs vinyl collection using the Discogs API.

## Features

- 📀 Display your entire Discogs collection with album artwork
- 🎨 Clean, responsive grid layout
- 📄 Pagination support for large collections
- 🎵 Shows artist, year, label, format, and genres for each release
- 🔍 Detailed release information including catalog numbers

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   The application requires the following environment variables:
   - `DISCOGS_USER_TOKEN` - Your Discogs personal access token
   - `DISCOGS_USERNAME` - Your Discogs username
   
   To get your credentials:
   - Visit https://www.discogs.com/settings/developers
   - Generate a personal access token
   
   Set these variables using your platform's standard method (e.g., export in shell, platform config, etc.)

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   If running in a container or need network access:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

4. **Open your browser:**
   - Navigate to http://localhost:5173
   - Your collection should appear!

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Full-stack Svelte framework
- [Discogs API](https://www.discogs.com/developers) - Music database API
- TypeScript - Type safety

## API Rate Limiting

The Discogs API has rate limiting:
- 60 requests per minute for authenticated requests
- The app displays 50 releases per page to stay within limits

## License

MIT
