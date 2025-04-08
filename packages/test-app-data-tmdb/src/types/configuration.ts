import type {
	DefaultFilter,
	Id,
	ImageType,
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
	| DefaultFilter
	| {
			filterBy: 'discover';
			type: 'movie';
			title: string;
			pageItemType: 'movie';
	  }
	| {
			filterBy: 'discover';
			type: 'series';
			title: string;
			pageItemType: 'series';
	  }
	| {
			filterBy: 'trending';
			type: 'movie';
			timeWindow?: TrendingTimeWindow;
			title: string;
			pageItemType: 'movie';
	  }
	| {
			filterBy: 'trending';
			type: 'series';
			timeWindow?: TrendingTimeWindow;
			title: string;
			pageItemType: 'series';
	  }
	| {
			filterBy: 'genre';
			id: Id;
			type: 'movie' | 'series';
			title: string;
			pageItemType: 'genre';
	  }
	| {
			filterBy: 'genres';
			type: 'movie' | 'series';
			title: string;
			pageItemType: 'genre';
	  };

export type TmdbConfiguration = {
	filter: TmdbConfigurationFilters;
};
