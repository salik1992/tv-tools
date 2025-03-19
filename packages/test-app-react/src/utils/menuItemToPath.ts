import { type MenuItem, ScreenType } from '@salik1992/test-app-data/types';

export const menuItemToPath = (item: MenuItem) => {
	switch (item.screen) {
		case ScreenType.Home:
			return '/';
		case ScreenType.Detail:
			return `/detail/${item.params[0]}/${item.params[1]}`;
		case ScreenType.Discover:
			return '/discover/' + item.params[0];
		default:
			return `/${item.screen}`;
	}
};
