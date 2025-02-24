export type KeyInformation = { keyCode?: number; code?: string };
export type KeyOption = { ignoreRtl?: boolean };

export interface Key {
	is<T extends KeyInformation>(event: T, { ignoreRtl }?: KeyOption): boolean;

	toKeyboardEvent(
		type: KeyboardEvent['type'],
		{ rtl }?: { rtl?: boolean },
	): KeyboardEvent;
}
