<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
		<div class="stats">
			<p>Total items: {data.pagination.items}</p>
			<p>
				Page {data.pagination.page} of {data.pagination.pages}
			</p>
		</div>

		<div class="collection-grid">
			{#each data.collection as release (release.instance_id)}
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

		{#if data.pagination.pages > 1}
			<nav class="pagination">
				{#if data.pagination.page > 1}
					<a href="?page={data.pagination.page - 1}" class="pagination-link">← Previous</a>
				{/if}

				<span class="pagination-info">
					Page {data.pagination.page} of {data.pagination.pages}
				</span>

				{#if data.pagination.page < data.pagination.pages}
					<a href="?page={data.pagination.page + 1}" class="pagination-link">Next →</a>
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

	.stats {
		display: flex;
		gap: 2rem;
		justify-content: center;
		margin-bottom: 2rem;
		font-size: 1.1rem;
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
