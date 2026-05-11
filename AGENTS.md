# Discogs Collection Viewer - Agent Documentation

## Project Overview

This is a SvelteKit application that displays a user's vinyl/music collection from the Discogs platform using the Discogs API. The app fetches and displays album artwork, artist information, release details, and supports pagination for large collections.

## Tech Stack

- **Framework**: SvelteKit (Svelte 5 with runes)
- **Language**: TypeScript
- **API**: Discogs API v2
- **Package Manager**: npm

## Project Structure

```
/workspace/sources/
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg       # Favicon
│   │   ├── types.ts              # TypeScript interfaces for Discogs API
│   │   └── index.ts              # Lib exports
│   ├── routes/
│   │   ├── +page.svelte          # Main UI component (collection grid)
│   │   ├── +page.server.ts       # Server-side data fetching
│   │   └── +layout.svelte        # Root layout (favicon setup)
│   ├── app.html                  # HTML template
│   └── app.d.ts                  # TypeScript declarations
├── static/                       # Static assets
├── package.json                  # Dependencies and scripts
├── svelte.config.js              # SvelteKit configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # User-facing documentation
```

## Key Files

### `src/lib/types.ts`
Defines TypeScript interfaces for:
- `DiscogsRelease`: Individual release/album data structure
- `DiscogsCollectionResponse`: API response with pagination

### `src/routes/+page.server.ts`
Server-side load function that:
- Reads `DISCOGS_USER_TOKEN` and `DISCOGS_USERNAME` from environment variables
- Fetches collection from `https://api.discogs.com/users/{username}/collection/folders/0/releases`
- Folder ID `0` represents the "All" folder (entire collection)
- Implements pagination (50 items per page)
- Requires headers:
  - `User-Agent: DiscogsCollectionApp/1.0`
  - `Authorization: Discogs token={DISCOGS_USER_TOKEN}`

### `src/routes/+page.svelte`
Main UI component with:
- Svelte 5 runes syntax (`$props()`, `{#each}`, `{#if}`)
- Responsive CSS grid layout (auto-fill, 280px minimum width)
- Displays: album artwork, artist, year, label, catalog number, format, genres
- Pagination controls (Previous/Next buttons)
- Error handling with helpful setup instructions

## Environment Variables

Required environment variables (set by user/platform):
- `DISCOGS_USER_TOKEN` - Discogs personal access token
- `DISCOGS_USERNAME` - Discogs username

**Getting Credentials:**
1. Visit https://www.discogs.com/settings/developers
2. Generate a personal access token
3. Set the environment variables using your platform's standard method

## Discogs API Details

**Endpoint Used:**
```
GET /users/{username}/collection/folders/{folder_id}/releases
```

**Rate Limiting:**
- 60 requests per minute for authenticated requests
- App uses 50 items per page to stay within limits

**Response Structure:**
- `pagination`: Contains page info and total items count
- `releases`: Array of release objects with:
  - `basic_information`: Core data (title, artists, year, formats, genres, cover images)
  - `instance_id`: Unique ID for each item in collection (used as React key)
  - `date_added`: When added to collection
  - `rating`: User's rating (if set)

## Development Workflow

**Start dev server:**
```bash
cd /workspace/sources
npm run dev -- --host 0.0.0.0
```
- Use `--host 0.0.0.0` to make the server accessible from outside the container
- Server runs on http://localhost:5173 (container)
- Port 5173 is configured for forwarding in `.kaiden/workspace.json`

**Build for production:**
```bash
npm run build
npm run preview
```

## Svelte 5 Patterns Used

- `let { data } = $props()` - Props declaration
- `{#each array as item (key)}` - Keyed each blocks (required in Svelte 5)
- Scoped `<style>` - Component-scoped CSS
- Server-side data loading with `+page.server.ts`

## Potential Future Enhancements

1. **Search/Filter**: Add filtering by artist, genre, format
2. **Sorting**: Allow sorting by artist, year, date added
3. **Detail View**: Click release to see full details (tracklist, notes, etc.)
4. **Stats Dashboard**: Show collection statistics (total releases, genres breakdown, etc.)
5. **Wantlist Integration**: Also display user's wantlist
6. **Release Notes**: Show condition, notes from collection
7. **Multiple Collections**: Support viewing different folders
8. **Export**: Export collection data to CSV/JSON
9. **Caching**: Add API response caching to reduce rate limit usage
10. **Loading States**: Add skeleton loaders while fetching data

## Common Issues & Solutions

**Error: Missing credentials**
- Ensure environment variables `DISCOGS_USER_TOKEN` and `DISCOGS_USERNAME` are set

**Error: 401 Unauthorized**
- Token may be invalid or expired - regenerate at https://www.discogs.com/settings/developers

**Error: 429 Rate Limited**
- Too many requests - Discogs limits to 60/minute
- Consider implementing client-side caching or reducing page size

**Empty collection**
- Verify username is correct
- Check that user has releases in their collection (folder 0)

## API Documentation References

- Discogs API Docs: https://www.discogs.com/developers
- Authentication: https://www.discogs.com/developers/#page:authentication
- Collection Endpoint: https://www.discogs.com/developers/#page:user-collection,header:user-collection-collection

## Workspace Configuration

### Dev Container Features

The workspace includes these local features in `.kaiden/features/`:

**Chromium Browser** (`./features/chromium`)
- Installs Chromium browser for Playwright
- Uses `dnf` (Fedora package manager)
- Executable at `/usr/bin/chromium-browser`
- Configured in `.kaiden/workspace.json`

### Port Forwarding

- Port 5173 (SvelteKit dev server) is configured for forwarding
- Access via `kdn workspace open <workspace-name> 5173` on host

## Notes for Future Sessions

- Environment variables are already configured and working
- The app is functional and running on localhost:5173
- TypeScript types match the current Discogs API v2 response format
- Svelte component has been validated with svelte-autofixer tool
- All code follows Svelte 5 best practices (runes, keyed each blocks)
- Chromium is installed via local dev container feature for Playwright testing
