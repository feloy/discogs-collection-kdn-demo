import { DISCOGS_USER_TOKEN, DISCOGS_USERNAME } from '$env/static/private';
import type { DiscogsCollectionResponse } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 50;

	if (!DISCOGS_USER_TOKEN || !DISCOGS_USERNAME) {
		return {
			error: 'Missing Discogs API credentials. Please set DISCOGS_USER_TOKEN and DISCOGS_USERNAME in .env file'
		};
	}

	try {
		// Fetch collection from Discogs API
		// Folder ID 0 is the "All" folder which contains all releases
		const response = await fetch(
			`https://api.discogs.com/users/${DISCOGS_USERNAME}/collection/folders/0/releases?page=${page}&per_page=${perPage}`,
			{
				headers: {
					'User-Agent': 'DiscogsCollectionApp/1.0',
					'Authorization': `Discogs token=${DISCOGS_USER_TOKEN}`
				}
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Discogs API Error:', response.status, errorText);
			return {
				error: `Failed to fetch collection: ${response.status} ${response.statusText}`
			};
		}

		const data: DiscogsCollectionResponse = await response.json();

		return {
			collection: data.releases,
			pagination: data.pagination
		};
	} catch (error) {
		console.error('Error fetching collection:', error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
};
