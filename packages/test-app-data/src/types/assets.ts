export type Id = string;

export type AssetType = 'movie' | 'series' | 'season' | 'episode' | 'person';

export type Genre = {
	id: Id;
	title: string;
};

export type Country = {
	iso_3166_1: string;
	title: string;
};

export type Language = {
	englishTitle: string;
	iso_639_1: string;
	title: string;
};

export type ProductionCompany = {
	logo: string;
	title: string;
	country: string;
};

export type Asset = {
	type: AssetType;
	id: Id;
	title: string;
	description: string;
	original: {
		language: string;
		title: string;
	};
	images: {
		backdrop: string;
		poster: string;
	};
	rating?: {
		value: number;
		unit: string;
		votes?: number;
	};
};

export type MovieAsset = Asset & {
	type: 'movie';
	genres: Genre[];
	adult: boolean;
	releaseDate: string;
	hasVideo: boolean;
	collection?: Id;
	budget?: number;
	productionCompanies?: ProductionCompany[];
	countries?: Country[];
	revenue?: number;
	runtime?: number;
	languages?: Language[];
};

export type SeriesAsset = Asset & {
	type: 'series';
	genres: Genre[];
	releaseDate: string;
	seasons: Id[];
};

export type SeasonAsset = Asset & {
	type: 'season';
	episodes: Id[];
};

export type EpisodeAsset = Asset & {
	type: 'episode';
	genres: Genre[];
	adult: boolean;
	releaseDate: string;
	hasVideo: boolean;
};

export type PersonAsset = Asset & {
	type: 'person';
	birth: string;
	death?: string;
	knownFor: {
		type: AssetType;
		id: Id;
		title: string;
		role: string;
	}[];
};

export type AssetMapping = {
	movie: MovieAsset;
	series: SeriesAsset;
	season: SeasonAsset;
	episode: EpisodeAsset;
	person: PersonAsset;
};

export type Paged<T> = {
	[page: number]: T[];
	pages: number;
};
