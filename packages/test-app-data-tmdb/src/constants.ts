import { ListType, ScreenType } from '@salik1992/test-app-data/types';

export const GENERIC_TYPE_TO_TMDB_TYPE = {
	movie: 'movie',
	series: 'tv',
	season: 'season',
	episode: 'episode',
	person: 'people',
} as const;

export const BASE_URL = 'https://api.themoviedb.org/3';

export const MENU = [
	{
		title: 'Home',
		glyph: '\u2302',
		screen: ScreenType.Browse,
		params: ['home'],
	},
	{ title: 'Search', glyph: '\u2328', screen: ScreenType.Search },
	{
		title: 'Genres',
		glyph: '\u2388',
		screen: ScreenType.Discover,
		params: ['genres'],
	},
];

export const BROWSE = {
	home: [
		{
			id: 'trending-movies',
			title: 'Trending Movies',
			listType: ListType.HERO,
			listData: {
				filterBy: 'trending',
				type: 'movie',
				timeWindow: 'day',
			},
		},
		{
			id: 'trending-tv',
			title: 'Trending TV',
			listType: ListType.NORMAL,
			listData: {
				filterBy: 'trending',
				type: 'series',
				timeWindow: 'day',
			},
		},
		{
			id: 'discover-movies',
			title: 'Discover Movies',
			listType: ListType.NORMAL,
			listData: { filterBy: 'discover', type: 'movie' },
		},
		{
			id: 'discover-tv',
			title: 'Discover TV',
			listType: ListType.NORMAL,
			listData: { filterBy: 'discover', type: 'series' },
		},
	],
};
