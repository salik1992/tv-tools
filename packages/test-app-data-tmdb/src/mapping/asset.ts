import type {
	Asset,
	AssetImages,
	AssetMapping,
	AssetType,
	GenreAsset,
	MovieAsset,
	Paged,
	PersonAsset,
	SeriesAsset,
} from '@salik1992/test-app-data/types';
import type {
	TmdbAsset,
	TmdbAssetMapping,
	TmdbBaseAsset,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbGenre,
	TmdbMovieAsset,
	TmdbPagedResults,
	TmdbPeopleAsset,
} from '../types';

export const mapImages = <
	T extends {
		backdrop_path?: string;
		poster_path?: string;
		profile_path?: string;
	},
>(
	a: T,
): AssetImages['images'] => ({
	backdrop: a.backdrop_path,
	poster: a.poster_path,
	profile: a.profile_path,
});

export const mapGenre =
	(relatedAssetType?: AssetType) =>
	(g: TmdbGenre): GenreAsset => ({
		id: `${g.id}`,
		title: g.name,
		type: 'genre',
		relatedAssetType,
	});

export const mapGenres =
	(relatedAssetType?: AssetType) =>
	<
		T extends
			| { genres: { id: number; name: string }[] }
			| { genre_ids: number[] },
	>(
		a: T,
	) =>
		(a as TmdbAsset).genres
			? (a as TmdbAsset).genres.map(mapGenre(relatedAssetType))
			: (a as TmdbBaseAsset).genre_ids
				? (a as TmdbBaseAsset).genre_ids.map(
						(g) =>
							({
								id: g.toString(),
								title: '',
								type: 'genre',
							}) as GenreAsset,
					)
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

export const mapCommonAsset = <T extends AssetType>(
	type: T,
	a: TmdbAsset | TmdbBaseAsset,
) => ({
	type,
	images: mapImages(a),
	genres: mapGenres(type)(a),
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
	...mapCommonAsset('movie', a),
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
	...mapCommonAsset('series', a),
	title: a.name,
	releaseDate: a.first_air_date,
	seasons: [],
});

export const mapPeopleAsset = (a: TmdbPeopleAsset): PersonAsset => ({
	id: `${a.id}`,
	type: 'person',
	title: a.name,
	description: (a.biography?.length ?? 0 > 0) ? a.biography : undefined,
	images: mapImages(a),
	original: {
		language: a.place_of_birth ?? '',
		title: a.original_name,
	},
	origin: a.place_of_birth ?? '',
	profession: a.known_for_department,
	birth: a.birthday ? new Date(a.birthday) : undefined,
	death: a.deathday ? new Date(a.deathday) : undefined,
	knownFor:
		a.known_for?.map((k) => ({
			id: `${k.id}`,
			title: k.title,
			type: 'movie',
		})) ?? [],
});

export const mapPage =
	<In extends TmdbBaseAsset, Out extends Asset>(
		page: number,
		assetMapping: (tmdbAsset: In) => Out,
	) =>
	(data: TmdbPagedResults<In>): Paged<Out> => ({
		pages: data.total_pages,
		[page]: data.results.map(assetMapping),
	});

const mappingFunctionByType = (type: AssetType) => {
	switch (type) {
		case 'movie':
			return mapBaseMovieAsset;
		case 'series':
			return mapTvAsset;
		case 'person':
			return mapPeopleAsset;
		default:
			return (_: TmdbBaseAsset) => ({}) as Asset;
	}
};

export const mapPageByAssetType =
	<In extends TmdbBaseAsset | TmdbPeopleAsset, Type extends AssetType>(
		page: number,
		assetType: Type,
	) =>
	// @ts-expect-error: difficult mapping between types
	(data: TmdbPagedResults<In>): Paged<AssetMapping[typeof assetType]> => ({
		pages: data.total_pages,
		// @ts-expect-error: difficult mapping between types
		[page]: data.results.map(mappingFunctionByType(assetType)),
	});

export const mapFullAssetByType = <Type extends AssetType>(
	type: Type,
	asset: TmdbAssetMapping[typeof type],
): AssetMapping[typeof type] => {
	switch (type) {
		case 'movie':
			// @ts-expect-error: difficult mapping between types
			return mapMovieAsset(asset as TmdbMovieAsset);
		case 'series':
			// @ts-expect-error: difficult mapping between types
			return mapTvAsset(asset as TmdbBaseTvAsset);
		case 'person':
			// @ts-expect-error: difficult mapping between types
			return mapPeopleAsset(asset as TmdbPeopleAsset);
		default:
			return {} as AssetMapping[typeof type];
	}
};
