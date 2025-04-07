import type {
	EpisodeAsset,
	GenreAsset,
	Id,
	ImageType,
	MovieAsset,
	SeasonAsset,
	SeriesAsset,
} from '@salik1992/test-app-data/types';
import type { TrendingTimeWindow } from './asset';

export type ConfigurationResponse = {
	images: {
		base_url: string;
		secure_base_url: string;
		backdrop_sizes: string[];
		logo_sizes: string[];
		poster_sizes: string[];
		profile_sizes: string[];
		still_sizes: string[];
	};
	change_keys: string[];
};

export type ImageSize = {
	id: string;
	width?: number;
	height?: number;
};

export type Configuration = {
	images: {
		base: string;
		sizes: Record<ImageType, ImageSize[]>;
	};
};

export type TmdbConfigurationFilters =
	| {
			filterBy: 'seasons';
			seriesId: Id;
			title: string;
			pageItemType: SeasonAsset;
	  }
	| {
			filterBy: 'episodes';
			seasonId: Id;
			title: string;
			pageItemType: EpisodeAsset;
	  }
	| {
			filterBy: 'discover';
			type: 'movie';
			title: string;
			pageItemType: MovieAsset;
	  }
	| {
			filterBy: 'discover';
			type: 'series';
			title: string;
			pageItemType: SeriesAsset;
	  }
	| {
			filterBy: 'trending';
			type: 'movie';
			timeWindow?: TrendingTimeWindow;
			title: string;
			pageItemType: MovieAsset;
	  }
	| {
			filterBy: 'trending';
			type: 'series';
			timeWindow?: TrendingTimeWindow;
			title: string;
			pageItemType: SeriesAsset;
	  }
	| {
			filterBy: 'genre';
			id: Id;
			type: 'movie' | 'series';
			title: string;
			pageItemType: GenreAsset;
	  }
	| {
			filterBy: 'genres';
			type: 'movie' | 'series';
			title: string;
			pageItemType: GenreAsset;
	  }
	| {
			filterBy: 'search';
			type: 'movie';
			query: string;
			title: string;
			pageItemType: MovieAsset;
	  }
	| {
			filterBy: 'search';
			type: 'series';
			query: string;
			title: string;
			pageItemType: SeriesAsset;
	  };

export type TmdbConfiguration = {
	filter: TmdbConfigurationFilters;
};
