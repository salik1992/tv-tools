import type {
	Asset,
	AssetMapping,
	AssetType,
	BrowseItem,
	DefaultFilter,
	Id,
	ImageSize,
	ImageType,
	MenuItem,
	Paged,
} from './types';

export abstract class DataProvider<
	Configuration extends {
		filter: DefaultFilter;
	},
> {
	public abstract initialize(): Promise<void>;

	public abstract getImageUrl(
		asset: Asset,
		types: ImageType[],
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
