import type {
	TmdbAsset,
	TmdbBaseMovieAsset,
	TmdbBaseTvAsset,
	TmdbPagedResults,
} from './tmdbTypes';
import type { Asset, Paged } from './types';

export const mapPage =
	<In extends TmdbAsset>(
		page: number,
		assetMapping: (tmdbAsset: In) => Asset,
	) =>
	(data: TmdbPagedResults<In>): Paged<Asset> => ({
		pages: data.total_pages,
		[page]: data.results.map(assetMapping),
	});

export const mapImages = (
	a: TmdbBaseMovieAsset | TmdbBaseTvAsset,
): Asset['images'] => ({
	backdrop: a.backdrop_path,
	poster: a.poster_path,
});

export const mapOriginal = (a: TmdbAsset) => ({
	language: a.original_language,
	title: a.original_title,
});

export const mapCommonAsset = (a: TmdbAsset) => ({
	images: mapImages(a),
	genres: a.genre_ids,
	id: a.id,
	original: mapOriginal(a),
	description: a.overview,
});

export const mapMovieAsset = (a: TmdbBaseMovieAsset): Asset => ({
	...mapCommonAsset(a),
	adult: a.adult,
	title: a.title,
	releaseDate: a.release_date,
	hasVideo: a.video,
});

export const mapTvAsset = (a: TmdbBaseTvAsset): Asset => ({
	...mapCommonAsset(a),
	adult: false,
	title: a.name,
	releaseDate: a.first_air_date,
	hasVideo: false,
});
