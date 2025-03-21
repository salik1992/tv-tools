import type {
	Asset,
	MovieAsset,
	Paged,
	SeriesAsset,
} from '@salik1992/test-app-data/types';
import type {
	TmdbAsset,
	TmdbBaseAsset,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbMovieAsset,
	TmdbPagedResults,
} from '../types';

export const mapPage =
	<In extends TmdbBaseAsset>(
		page: number,
		assetMapping: (tmdbAsset: In) => Asset,
	) =>
	(data: TmdbPagedResults<In>): Paged<Asset> => ({
		pages: data.total_pages,
		[page]: data.results.map(assetMapping),
	});

export const mapImages = <
	T extends { backdrop_path: string; poster_path: string },
>(
	a: T,
): Asset['images'] => ({
	backdrop: a.backdrop_path,
	poster: a.poster_path,
});

export const mapGenres = <
	T extends
		| { genres: { id: number; name: string }[] }
		| { genre_ids: number[] },
>(
	a: T,
) =>
	(a as TmdbAsset).genres
		? (a as TmdbAsset).genres.map((g) => ({
				id: `${g.id}`,
				title: g.name,
			}))
		: (a as TmdbBaseAsset).genre_ids
			? (a as TmdbBaseAsset).genre_ids.map((g) => ({
					id: g.toString(),
					title: '',
				}))
			: [];

export const mapOriginal = <
	T extends { original_language: string; original_title: string },
>(
	a: T,
) => ({
	language: a.original_language,
	title: a.original_title,
});

export const mapProductionCompanies = <
	T extends {
		production_companies: {
			logo_path: string;
			name: string;
			origin_country: string;
		}[];
	},
>(
	a: T,
) =>
	a.production_companies.map((c) => ({
		logo: c.logo_path,
		title: c.name,
		country: c.origin_country,
	}));

export const mapCountries = (a: TmdbMovieAsset) =>
	a.production_countries.map((c) => ({
		iso_3166_1: c.iso_3166_1,
		title: c.name,
	}));

export const mapLanguages = (a: TmdbMovieAsset) =>
	a.spoken_languages.map((l) => ({
		englishTitle: l.english_name,
		iso_639_1: l.iso_639_1,
		title: l.name,
	}));

export const mapCommonAsset = (a: TmdbAsset | TmdbBaseAsset) => ({
	images: mapImages(a),
	genres: mapGenres(a),
	id: `${a.id}`,
	original: mapOriginal(a),
	description: a.overview,
	rating: {
		value: a.vote_average,
		unit: '/10',
		votes: a.vote_count,
	},
});

export const mapBaseMovieAsset = (
	a: TmdbMovieAsset | TmdbBaseMovieAsset,
): MovieAsset => ({
	...mapCommonAsset(a),
	type: 'movie',
	adult: a.adult,
	title: a.title,
	releaseDate: a.release_date,
	hasVideo: a.video,
});

export const mapMovieAsset = (a: TmdbMovieAsset): MovieAsset => ({
	...mapBaseMovieAsset(a),
	collection: a.belongs_to_collection ?? undefined,
	budget: a.budget,
	productionCompanies: mapProductionCompanies(a),
	countries: mapCountries(a),
	revenue: a.revenue,
	runtime: a.runtime,
	languages: mapLanguages(a),
});

export const mapTvAsset = (a: TmdbBaseTvAsset): SeriesAsset => ({
	...mapCommonAsset(a),
	type: 'series',
	title: a.name,
	releaseDate: a.first_air_date,
	seasons: [],
});
