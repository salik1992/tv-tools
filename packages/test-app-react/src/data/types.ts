export type Id = string | number;

export type Asset = {
	adult: boolean;
	images: {
		backdrop: string;
		poster: string;
	};
	genres: Id[];
	id: Id;
	original: {
		language: string;
		title: string;
	};
	description: string;
	title: string;
	releaseDate: string;
	hasVideo: boolean;
};

export type Paged<T> = {
	[page: number]: T[];
	pages: number;
};
