import { env } from '$env/dynamic/private';
import type { DiscogsCollectionResponse } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const perPage = 100;

	if (!env.DISCOGS_USER_TOKEN || !env.DISCOGS_USERNAME) {
		return {
			error: 'Missing Discogs API credentials. Please set env.DISCOGS_USER_TOKEN and env.DISCOGS_USERNAME in .env file'
		};
	}

	try {
		// Fetch first page to get total count
		const firstResponse = await fetch(
			`https://api.discogs.com/users/${env.DISCOGS_USERNAME}/collection/folders/0/releases?page=1&per_page=${perPage}`,
			{
				headers: {
					'User-Agent': 'DiscogsCollectionApp/1.0',
					'Authorization': `Discogs token=${env.DISCOGS_USER_TOKEN}`
				}
			}
		);

		if (!firstResponse.ok) {
			const errorText = await firstResponse.text();
			console.error('Discogs API Error:', firstResponse.status, errorText);
			return {
				error: `Failed to fetch collection: ${firstResponse.status} ${firstResponse.statusText}`
			};
		}

		const firstData: DiscogsCollectionResponse = await firstResponse.json();
		const totalPages = firstData.pagination.pages;
		let allReleases = [...firstData.releases];

		// Fetch remaining pages
		const fetchPromises = [];
		for (let page = 2; page <= totalPages; page++) {
			fetchPromises.push(
				fetch(
					`https://api.discogs.com/users/${env.DISCOGS_USERNAME}/collection/folders/0/releases?page=${page}&per_page=${perPage}`,
					{
						headers: {
							'User-Agent': 'DiscogsCollectionApp/1.0',
							'Authorization': `Discogs token=${env.DISCOGS_USER_TOKEN}`
						}
					}
				).then((res) => res.json())
			);
		}

		const remainingData = await Promise.all(fetchPromises);
		for (const data of remainingData) {
			allReleases = allReleases.concat(data.releases);
		}

		return {
			collection: allReleases,
			totalItems: firstData.pagination.items
		};
	} catch (error) {
		console.error('Error fetching collection:', error);
		return {
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
};
