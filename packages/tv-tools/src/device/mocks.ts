import type { Feature } from './Device';

export const Features: Feature[] = [
	'volume',
	'screensaver',
	'4k',
	'8k',
	'multiplayer',
	'widevine-ctr',
	'widevine-cbc',
	'playready-ctr',
	'playready-cbc',
	'fairplay',
] as const;
