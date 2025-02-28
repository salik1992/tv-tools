export type TmdbBaseMovieAsset = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type TmdbBaseTvAsset = {
	backdrop_path: string;
	first_air_date: string;
	genre_ids: number[];
	id: number;
	name: string;
	origin_country: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	vote_average: number;
	vote_count: number;
};

export type TmdbAsset = TmdbBaseMovieAsset | TmdbBaseTvAsset;

export type TmdbPagedResults<T> = {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
};

export type DiscoverTypes = 'movie' | 'tv';
export type DiscoverMapping = {
	movie: TmdbBaseMovieAsset;
	tv: TmdbBaseTvAsset;
};

export type TrendingTypes = 'movie' | 'tv'; // TODO: | 'people';
export type TrendingTimeWindow = 'day' | 'week';
export type TrendingMapping = {
	movie: TmdbBaseMovieAsset;
	tv: TmdbBaseTvAsset;
};
