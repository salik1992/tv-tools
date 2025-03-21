export type TmdbImages = {
	backdrop_path: string;
	poster_path: string;
};

export type TmdbGenre = {
	id: number;
	name: string;
};

export type TmdbGenres = {
	genres: TmdbGenre[];
};

export type TmdbBaseGenre = number;

export type TmdbBaseGenres = {
	genre_ids: TmdbBaseGenre[];
};

export type TmdbAssetBase = {
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	vote_average: number;
	vote_count: number;
} & TmdbImages &
	TmdbBaseGenres;

export type TmdbBaseMovieAsset = TmdbAssetBase & {
	adult: boolean;
	release_date: string;
	title: string;
	video: boolean;
};

export type TmdbMovieAsset = Omit<TmdbBaseMovieAsset, 'genre_ids'> & {
	belongs_to_collection: string;
	budget: number;
	homepage: string;
	production_companies: {
		id: string;
		logo_path: string;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	revenue: number;
	runtime: number;
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
} & TmdbGenres;

export type TmdbBaseTvAsset = TmdbAssetBase & {
	first_air_date: string;
	name: string;
	origin_country: string;
};

export type TmdbBaseAsset = TmdbBaseMovieAsset | TmdbBaseTvAsset;
export type TmdbAsset = TmdbMovieAsset;

export type TmdbPagedResults<T> = {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
};

export type DiscoverTypes = 'movie' | 'series';
export type TmdbAssetMapping = {
	movie: TmdbBaseMovieAsset;
	series: TmdbBaseTvAsset;
	season: TmdbAsset;
	person: TmdbAsset;
	episode: TmdbAsset;
	genre: TmdbGenre;
};

export type TrendingTypes = 'movie' | 'series'; // TODO: | 'people';
export type TrendingTimeWindow = 'day' | 'week';
