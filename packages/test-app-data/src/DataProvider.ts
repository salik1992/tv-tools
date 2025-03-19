import type {
	Asset,
	AssetMapping,
	AssetType,
	BrowseItem,
	ConfigurationFilter,
	Id,
	ImageSize,
	MenuItem,
	Paged,
} from './types';

export abstract class DataProvider<
	Configuration extends {
		filter: ConfigurationFilter;
	},
> {
	public abstract getImageUrl(
		asset: Asset,
		types: (keyof Asset['images'])[],
		size: ImageSize,
	): string | null;

	public abstract getMenu(): Promise<MenuItem[]>;

	public abstract getBrowse(
		id: Id,
	): Promise<BrowseItem<Configuration['filter']>[]>;

	public abstract getPagedAssets(
		filter: Configuration['filter'],
		page?: number,
	): Promise<Paged<Asset>>;

	public abstract getAsset(
		type: AssetType,
		id: Id,
	): Promise<AssetMapping[typeof type]>;
}
