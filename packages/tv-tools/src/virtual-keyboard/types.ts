import {
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

export type InternalAction<Layouts extends string> =
	| Action<Layouts>
	| ReturnType<typeof add>;

export type Key<Layouts extends string> = {
	key: string;
	char?: string;
	label?: string;
	colSpan?: number;
	rowSpan?: number;
	action?: Action<Layouts>;
};

type InternalKey<Layouts extends string> = Required<
	Omit<Key<Layouts>, 'action' | 'char'>
> & {
	onPress: () => true;
	focusOnMount: boolean;
};

type GetKeyId<K extends string | Key<string>> =
	K extends Key<string> ? K['key'] : K;

type Layout<Keys extends (string | Key<string>)[][]> = {
	keys: Keys;
	initialKey: GetKeyId<Keys[number][number]>;
};

export type VirtualKeyboardLayouts = {
	[layouName: string]: Layout<(string | Key<typeof layouName>)[][]>;
};

export type FullVirtualKeyboardLayouts = {
	[layoutName: string]: InternalKey<typeof layoutName>[][];
};

export type RenderData = {
	effect: string | undefined;
	layoutName: string;
	layout: InternalKey<string>[][];
};

export type VirtualKeyboardEvents = {
	renderData: RenderData;
	addChar: string;
	removeChar: never;
	done: never;
};
