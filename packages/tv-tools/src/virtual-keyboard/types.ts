import type {
	add,
	backspace,
	caps,
	del,
	done,
	end,
	home,
	layout,
	left,
	right,
	shift,
	shiftAndCaps,
} from './constants';

/**
 * List of public actions.
 */
export type Action<Layouts extends string> =
	| typeof shift
	| typeof caps
	| typeof shiftAndCaps
	| typeof backspace
	| typeof del
	| typeof left
	| typeof right
	| typeof home
	| typeof end
	| typeof done
	| ReturnType<typeof layout<Layouts>>;

/**
 * List of all actions.
 */
export type InternalAction<Layouts extends string> =
	| Action<Layouts>
	| ReturnType<typeof add>;

/**
 * Key object type.
 */
export type Key<Layouts extends string> = {
	/**
	 * The key id.
	 */
	key: string;
	/**
	 * Chars to be inserted when the key is pressed. (Default: key)
	 */
	char?: string;
	/**
	 * Label to be displayed on the key. (Default: key)
	 */
	label?: string;
	/**
	 * Number of columns to span. (Default: 1)
	 */
	colSpan?: number;
	/**
	 * Number of rows to span. (Default: 1)
	 */
	rowSpan?: number;
	/**
	 * The action to be executed when the key is pressed.
	 */
	action?: Action<Layouts>;
};

/**
 * Key object type used in full layout. Char and action are replaced by onPress.
 * Also, focusOnMount is added to indicate if the key should be focused on mount.
 */
type InternalKey<Layouts extends string> = Required<
	Omit<Key<Layouts>, 'action' | 'char'>
> & {
	onPress: () => true;
	focusOnMount: boolean;
};

/**
 * Get the key id from the key object or string.
 */
type GetKeyId<K extends string | Key<string>> =
	K extends Key<string> ? K['key'] : K;

/**
 * The single layout type.
 */
type Layout<Keys extends (string | Key<string>)[][]> = {
	keys: Keys;
	initialKey?: GetKeyId<Keys[number][number]>;
};

/**
 * The virtual keyboard layouts.
 */
export type VirtualKeyboardLayouts = {
	[layouName: string]: Layout<(string | Key<typeof layouName>)[][]>;
};

/**
 * The full virtual keyboard layouts used internally.
 */
export type FullVirtualKeyboardLayouts = {
	[layoutName: string]: InternalKey<typeof layoutName>[][];
};

/**
 * Data for rendering the virtual keyboard.
 */
export type RenderData = {
	effect: string | undefined;
	layoutName: string;
	layout: InternalKey<string>[][];
};

/**
 * The virtual keyboard events.
 */
export type VirtualKeyboardEvents = {
	/**
	 * The event dispatched when the keyboard layout needs to be changed.
	 */
	renderData: RenderData;
	/**
	 * The event dispatched when chars should be added to input.
	 */
	addChar: string;
	/**
	 * The event dispatched when chars should be removed from end of input.
	 */
	removeChar: never;
	/**
	 * The event dispatched when the keyboard input is finished.
	 */
	done: never;
};
