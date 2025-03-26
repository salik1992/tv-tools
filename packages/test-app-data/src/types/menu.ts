import type { ConfigurationFilter, ScreenType } from './app';
import type { AssetType, Id } from './assets';

export type MenuItem = {
	title: string;
	glyph: string;
} & (
	| {
			screen: ScreenType.Browse;
			params: [Id];
	  }
	| {
			screen: ScreenType.Detail;
			params: [AssetType, Id];
	  }
	| {
			screen: ScreenType.Discover;
			params: [ConfigurationFilter];
	  }
	| {
			screen: ScreenType.Search;
	  }
);
