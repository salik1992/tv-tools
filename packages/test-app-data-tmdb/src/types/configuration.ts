import type {
	EpisodeAsset,
	Genre,
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

export type TmdbConfiguration = {
	filter:
		| { filterBy: 'seasons'; seriesId: Id; pageItemType: SeasonAsset }
		| { filterBy: 'episodes'; seasonId: Id; pageItemType: EpisodeAsset }
		| { filterBy: 'discover'; type: 'movie'; pageItemType: MovieAsset }
		| { filterBy: 'discover'; type: 'series'; pageItemType: SeriesAsset }
		| {
				filterBy: 'trending';
				type: 'movie';
				timeWindow?: TrendingTimeWindow;
				pageItemType: MovieAsset;
		  }
		| {
				filterBy: 'trending';
				type: 'series';
				timeWindow?: TrendingTimeWindow;
				pageItemType: SeriesAsset;
		  }
		| { filterBy: 'genre'; id: Id; pageItemType: Genre };
};
