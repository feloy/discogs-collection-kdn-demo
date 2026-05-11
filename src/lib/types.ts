export interface DiscogsRelease {
	id: number;
	instance_id: number;
	date_added: string;
	rating: number;
	basic_information: {
		id: number;
		title: string;
		year: number;
		artists: Array<{
			name: string;
			id: number;
		}>;
		labels: Array<{
			name: string;
			catno: string;
		}>;
		formats: Array<{
			name: string;
			qty: string;
			descriptions?: string[];
		}>;
		thumb: string;
		cover_image: string;
		genres: string[];
		styles?: string[];
	};
}

export interface DiscogsCollectionResponse {
	pagination: {
		page: number;
		pages: number;
		per_page: number;
		items: number;
		urls: {
			next?: string;
			prev?: string;
		};
	};
	releases: DiscogsRelease[];
}
