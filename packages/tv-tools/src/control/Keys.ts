import { KeyInternal as Key } from './KeyInternal';

/**
 * List of all keys that are usually used for OTT applications.
 */
export const Keys = {
	// Directional navigation
	UP: new Key([38], ['ArrowUp']),
	DOWN: new Key([40], ['ArrowDown']),
	LEFT: new Key([37], ['ArrowLeft'], [39], ['ArrowRight']),
	RIGHT: new Key([39], ['ArrowRight'], [37], ['ArrowLeft']),

	// Actions
	ENTER: new Key([13], ['Enter']),
	BACK: new Key([8, 27], ['Escape', 'Backspace']),

	// Numbers
	NUMBER_0: new Key([48, 96], ['Digit0', 'Numpad0']),
	NUMBER_1: new Key([49, 97], ['Digit1', 'Numpad1']),
	NUMBER_2: new Key([50, 98], ['Digit2', 'Numpad2']),
	NUMBER_3: new Key([51, 99], ['Digit3', 'Numpad3']),
	NUMBER_4: new Key([52, 100], ['Digit4', 'Numpad4']),
	NUMBER_5: new Key([53, 101], ['Digit5', 'Numpad5']),
	NUMBER_6: new Key([54, 102], ['Digit6', 'Numpad6']),
	NUMBER_7: new Key([55, 103], ['Digit7', 'Numpad7']),
	NUMBER_8: new Key([56, 104], ['Digit8', 'Numpad8']),
	NUMBER_9: new Key([57, 105], ['Digit9', 'Numpad9']),

	// Special keys
	MENU: new Key([123], ['F12']),
	EXIT: new Key([115], ['F4']),
	DELETE: new Key([46, 112], ['Delete', 'F1']),

	// Color keys
	RED: new Key([82], ['KeyR']),
	GREEN: new Key([71], ['KeyG']),
	YELLOW: new Key([89], ['KeyY']),
	BLUE: new Key([66], ['KeyB']),

	// Media keys
	PLAY: new Key([179], ['MediaPlayPause']),
	PAUSE: new Key([120], ['F9']),
	PLAY_PAUSE: new Key([32], ['Space']),
	REWIND: new Key([377], ['MediaTrackPrevious']),
	FAST_FORWARD: new Key([376], ['MediaTrackNext']),
	STOP: new Key([178], ['MediaStop']),

	// Channel keys
	CHANNEL_UP: new Key([33], ['PageUp']),
	CHANNEL_DOWN: new Key([34], ['PageDown']),

	// Volume keys
	VOLUME_UP: new Key([175], ['AudioVolumeUp']),
	VOLUME_DOWN: new Key([174], ['AudioVolumeDown']),
};
