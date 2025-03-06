export type ImageType = 'backdrop' | 'logo' | 'poster' | 'profile' | 'still';

export type Images = Partial<Record<ImageType, string>>;

export type ImageSize = {
	width?: number;
	height?: number;
};
