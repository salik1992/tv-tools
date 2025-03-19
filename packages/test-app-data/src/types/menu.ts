import type { ScreenType } from './app';
import type { AssetType, Id } from './assets';

export type MenuItem = {
	title: string;
	glyph: string;
} & (
	| {
			screen: ScreenType.Home;
	  }
	| {
			screen: ScreenType.Detail;
			params: [AssetType, Id];
	  }
	| {
			screen: ScreenType.Discover;
			params: [string];
	  }
	| {
			screen: ScreenType.Search;
	  }
);
