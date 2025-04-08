import type { AssetType, Id } from './assets';

export enum ScreenType {
	Browse = 'browse',
	Detail = 'detail',
	Discover = 'discover',
	Search = 'search',
}

export enum ListType {
	HERO = 'hero',
	NORMAL = 'normal',
}

export type ConfigurationFilter = {
	filterBy: string;
	type?: string;
	query?: string;
	id?: Id;
	title: string;
	pageItemType: AssetType;
};

export type DefaultFilter =
	| {
			filterBy: 'seasons';
			seriesId: Id;
			title: string;
			pageItemType: 'season';
	  }
	| {
			filterBy: 'episodes';
			seasonId: Id;
			title: string;
			pageItemType: 'episode';
	  }
	| {
			filterBy: 'search';
			type: 'movie';
			query: string;
			title: string;
			pageItemType: 'movie';
	  }
	| {
			filterBy: 'search';
			type: 'series';
			query: string;
			title: string;
			pageItemType: 'series';
	  }
	| {
			filterBy: 'search';
			type: 'person';
			query: string;
			title: string;
			pageItemType: 'series';
	  };

export type BrowseItem<ListData extends ConfigurationFilter> = {
	id: Id;
	listType: ListType;
	listData: ListData;
};
