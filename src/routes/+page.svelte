<script lang="ts">
	import type { PageData } from './$types';
	import type { DiscogsRelease } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let sortOrder = $state<'artist' | 'title' | 'year' | 'date-added'>('artist');
	let showSevenInch = $state(true);
	let showLP = $state(true);
	let showCD = $state(true);
	let currentPage = $state(1);
	const itemsPerPage = 50;

	function hasFormat(release: DiscogsRelease, formatName: string): boolean {
		return release.basic_information.formats.some((format) =>
			format.name.toLowerCase().includes(formatName.toLowerCase())
		);
	}

	let filteredAndSorted = $derived.by(() => {
		if (!data.collection) return [];

		let collection = [...data.collection];

		// Filter by format
		collection = collection.filter((release) => {
			const formats = release.basic_information.formats;
			const formatStr = formats.map((f) => f.name).join(' ').toLowerCase();
			const descriptions = formats
				.flatMap((f) => f.descriptions || [])
				.join(' ')
				.toLowerCase();

			// Check format types
			const is7Inch = formatStr.includes('7"') || descriptions.includes('7"');
			const isLP = formatStr.includes('vinyl') && !is7Inch;
			const isCD = formatStr.includes('cd');

			// If none of the format matches any filter, include it if all filters are on
			// (this handles other formats like Cassette, etc.)
			if (!is7Inch && !isLP && !isCD) {
				return showSevenInch && showLP && showCD;
			}

			// Check if the release matches any selected format
			if (is7Inch && showSevenInch) return true;
			if (isLP && showLP) return true;
			if (isCD && showCD) return true;

			return false;
		});

		// Sort the filtered collection
		switch (sortOrder) {
			case 'artist':
				return collection.sort((a, b) => {
					const artistA = a.basic_information.artists[0]?.name || '';
					const artistB = b.basic_information.artists[0]?.name || '';
					return artistA.localeCompare(artistB);
				});
			case 'title':
				return collection.sort((a, b) =>
					a.basic_information.title.localeCompare(b.basic_information.title)
				);
			case 'year':
				return collection.sort((a, b) => {
					const yearA = a.basic_information.year || 0;
					const yearB = b.basic_information.year || 0;
					return yearB - yearA;
				});
			case 'date-added':
				return collection.sort((a, b) => {
					return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
				});
			default:
				return collection;
		}
	});

	let totalPages = $derived(Math.ceil(filteredAndSorted.length / itemsPerPage));

	let paginatedCollection = $derived.by(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredAndSorted.slice(startIndex, endIndex);
	});

	// Reset to page 1 when filters or sort order change
	$effect(() => {
		showSevenInch;
		showLP;
		showCD;
		sortOrder;
		currentPage = 1;
	});

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<div class="container">
	<header>
		<h1>My Discogs Collection</h1>
	</header>

	{#if data.error}
		<div class="error-message">
			<h2>Error</h2>
			<p>{data.error}</p>
			<p class="help-text">
				Make sure you've set your Discogs API credentials in the <code>.env</code> file:
			</p>
			<ul>
				<li><code>DISCOGS_USER_TOKEN</code> - Get from https://www.discogs.com/settings/developers</li>
				<li><code>DISCOGS_USERNAME</code> - Your Discogs username</li>
			</ul>
		</div>
	{:else if data.collection}
		<div class="controls">
			<div class="stats">
				<p>Total items: {filteredAndSorted.length}</p>
				<p>
					Page {currentPage} of {totalPages}
				</p>
			</div>

			<div class="filter-sort-controls">
				<div class="filter-control">
					<span class="control-label">Filter:</span>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={showSevenInch} />
						<span>7"</span>
					</label>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={showLP} />
						<span>LP</span>
					</label>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={showCD} />
						<span>CD</span>
					</label>
				</div>

				<div class="sort-control">
					<label for="sort-order">Sort by:</label>
					<select id="sort-order" bind:value={sortOrder}>
						<option value="artist">Artist</option>
						<option value="title">Title</option>
						<option value="year">Year (newest first)</option>
						<option value="date-added">Date Added (newest first)</option>
					</select>
				</div>
			</div>
		</div>

		<div class="collection-grid">
			{#each paginatedCollection as release (release.instance_id)}
				<article class="release-card">
					<div class="release-image">
						<img
							src={release.basic_information.cover_image || release.basic_information.thumb}
							alt={release.basic_information.title}
							loading="lazy"
						/>
					</div>
					<div class="release-info">
						<h2 class="release-title">{release.basic_information.title}</h2>
						<p class="release-artist">
							{release.basic_information.artists.map((a) => a.name).join(', ')}
						</p>
						{#if release.basic_information.year}
							<p class="release-year">{release.basic_information.year}</p>
						{/if}
						{#if release.basic_information.labels.length > 0}
							<p class="release-label">
								{release.basic_information.labels[0].name}
								{#if release.basic_information.labels[0].catno}
									— {release.basic_information.labels[0].catno}
								{/if}
							</p>
						{/if}
						{#if release.basic_information.formats.length > 0}
							<p class="release-format">
								{release.basic_information.formats
									.map((f) => `${f.qty}x ${f.name}`)
									.join(', ')}
							</p>
						{/if}
						{#if release.basic_information.genres.length > 0}
							<div class="release-genres">
								{#each release.basic_information.genres as genre (genre)}
									<span class="genre-tag">{genre}</span>
								{/each}
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		{#if totalPages > 1}
			<nav class="pagination">
				{#if currentPage > 1}
					<button onclick={() => goToPage(currentPage - 1)} class="pagination-link"
						>← Previous</button
					>
				{/if}

				<span class="pagination-info">
					Page {currentPage} of {totalPages}
				</span>

				{#if currentPage < totalPages}
					<button onclick={() => goToPage(currentPage + 1)} class="pagination-link"
						>Next →</button
					>
				{/if}
			</nav>
		{/if}
	{/if}
</div>

<style>
	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.error-message {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 2rem;
		margin: 2rem 0;
	}

	.error-message h2 {
		color: #c00;
		margin-top: 0;
	}

	.help-text {
		margin-top: 1rem;
		font-weight: 500;
	}

	code {
		background: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: monospace;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.stats {
		display: flex;
		gap: 2rem;
		font-size: 1.1rem;
	}

	.filter-sort-controls {
		display: flex;
		gap: 2rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.filter-control {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.control-label {
		font-weight: 500;
		color: #333;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #0066cc;
	}

	.checkbox-label span {
		font-size: 0.95rem;
		color: #555;
	}

	.sort-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.sort-control label {
		font-weight: 500;
		color: #333;
	}

	.sort-control select {
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
		background: white;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.sort-control select:hover {
		border-color: #0066cc;
	}

	.sort-control select:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
	}

	.collection-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.release-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.release-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.release-image {
		aspect-ratio: 1;
		overflow: hidden;
		background: #f0f0f0;
	}

	.release-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.release-info {
		padding: 1rem;
	}

	.release-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #222;
		line-height: 1.3;
	}

	.release-artist {
		font-weight: 500;
		margin: 0 0 0.5rem 0;
		color: #555;
	}

	.release-year,
	.release-label,
	.release-format {
		font-size: 0.9rem;
		margin: 0.25rem 0;
		color: #666;
	}

	.release-genres {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.genre-tag {
		background: #e0e0e0;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		color: #444;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 2rem 0;
	}

	.pagination-link {
		background: #0066cc;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 500;
		transition: background 0.2s;
	}

	.pagination-link:hover {
		background: #0052a3;
	}

	.pagination-info {
		font-weight: 500;
		color: #666;
	}
</style>
