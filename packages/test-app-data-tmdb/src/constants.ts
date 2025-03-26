import {
	ListType,
	type MenuItem,
	ScreenType,
} from '@salik1992/test-app-data/types';

export const BASE_URL = 'https://api.themoviedb.org/3';

export const GENERIC_TYPE_TO_TMDB_TYPE = {
	movie: 'movie',
	series: 'tv',
	season: 'season',
	episode: 'episode',
	person: 'people',
	genre: 'genre',
} as const;

export const MENU: MenuItem[] = [
	{
		title: 'Home',
		glyph: '\u2302',
		screen: ScreenType.Browse,
		params: ['home'],
	},
	{ title: 'Search', glyph: '\u2328', screen: ScreenType.Search },
	{
		title: 'Movies by genre',
		glyph: '\u2388',
		screen: ScreenType.Discover,
		params: [
			{
				filterBy: 'genres',
				type: 'movie',
				title: 'Movies by genre',
				pageItemType: 'genre',
			},
		],
	},
	{
		title: 'TV by genre',
		glyph: '\u2388',
		screen: ScreenType.Discover,
		params: [
			{
				filterBy: 'genres',
				type: 'series',
				title: 'TV by genre',
				pageItemType: 'genre',
			},
		],
	},
];

export const BROWSE = {
	home: [
		{
			id: 'trending-movies',
			listType: ListType.HERO,
			listData: {
				filterBy: 'trending',
				type: 'movie',
				timeWindow: 'day',
				title: 'Trending Movies',
			},
		},
		{
			id: 'trending-tv',
			listType: ListType.NORMAL,
			listData: {
				filterBy: 'trending',
				type: 'series',
				timeWindow: 'day',
				title: 'Trending TV',
			},
		},
		{
			id: 'discover-movies',
			listType: ListType.NORMAL,
			listData: {
				filterBy: 'discover',
				type: 'movie',
				title: 'Discover Movies',
			},
		},
		{
			id: 'discover-tv',
			listType: ListType.NORMAL,
			listData: {
				filterBy: 'discover',
				type: 'series',
				title: 'Discover TV',
			},
		},
	],
};
