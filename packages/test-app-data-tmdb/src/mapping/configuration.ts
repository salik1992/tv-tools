import type { Configuration, ConfigurationResponse, ImageSize } from '../types';

const mapImageSizes = (rawImageSize: string): ImageSize | null => {
	if (rawImageSize === 'original') {
		return {
			width: Number.MAX_SAFE_INTEGER,
			height: Number.MAX_SAFE_INTEGER,
			id: rawImageSize,
		};
	}
	if (/w\d+/.test(rawImageSize)) {
		return {
			width: parseInt(rawImageSize.replace('w', '')),
			id: rawImageSize,
		};
	}
	if (/h\d+/.test(rawImageSize)) {
		return {
			height: parseInt(rawImageSize.replace('h', '')),
			id: rawImageSize,
		};
	}
	return null;
};

function notNull<T>(item: T | null): item is T {
	return item !== null;
}

export const mapConfiguration = (
	rawConfig: ConfigurationResponse,
): Configuration => ({
	images: {
		base: rawConfig.images.secure_base_url,
		sizes: {
			backdrop: rawConfig.images.backdrop_sizes
				.map(mapImageSizes)
				.filter(notNull),
			logo: rawConfig.images.logo_sizes
				.map(mapImageSizes)
				.filter(notNull),
			poster: rawConfig.images.poster_sizes
				.map(mapImageSizes)
				.filter(notNull),
			profile: rawConfig.images.profile_sizes
				.map(mapImageSizes)
				.filter(notNull),
			still: rawConfig.images.still_sizes
				.map(mapImageSizes)
				.filter(notNull),
		},
	},
});
