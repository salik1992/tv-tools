import type {
	Asset,
	AssetMapping,
	AssetType,
	Id,
	ImageSize,
	MenuItem,
	Paged,
} from './types';

export abstract class DataProvider<
	Configuration extends {
		filter: {
			[key: string]: unknown;
			pageItemType: unknown;
		};
	},
> {
	public abstract getImageUrl(
		asset: Asset,
		types: (keyof Asset['images'])[],
		size: ImageSize,
	): string | null;

	public abstract getMenu(): Promise<MenuItem[]>;

	public abstract getPagedAssets(
		filter: Configuration['filter'],
		page?: number,
	): Promise<Paged<Asset>>;

	public abstract getAsset(
		type: AssetType,
		id: Id,
	): Promise<AssetMapping[typeof type]>;
}
