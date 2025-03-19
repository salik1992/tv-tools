import { Id } from './assets';

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
	[key: string]: unknown;
	pageItemType: unknown;
};

export type BrowseItem<ListData extends ConfigurationFilter> = {
	id: Id;
	title: string;
	listType: ListType;
	listData: ListData;
};
