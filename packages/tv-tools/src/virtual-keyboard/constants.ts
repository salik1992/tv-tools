export enum Effect {
	NONE,
	SHIFT,
	CAPS,
}

export const NEXT_EFFECT = {
	[Effect.NONE]: Effect.SHIFT,
	[Effect.SHIFT]: Effect.CAPS,
	[Effect.CAPS]: Effect.NONE,
} as const;

export const ADD = 'add';
export const SHIFT = 'shift';
export const CAPS = 'caps';
export const SHIFT_AND_CAPS = 'shiftAndCaps';
export const BACKSPACE = 'backspace';
export const DEL = 'delete';
export const LEFT = 'left';
export const RIGHT = 'right';
export const HOME = 'home';
export const END = 'end';
export const DONE = 'done';
export const LAYOUT = 'layout';

type Action<Payload = never> = {
	action: string;
	payload?: Payload;
};

export function add(s: string) {
	return function (): Action<string> {
		return { action: ADD, payload: s };
	};
}

export function shift(): Action {
	return { action: SHIFT };
}

export function caps(): Action {
	return { action: CAPS };
}

export function shiftAndCaps(): Action {
	return { action: SHIFT_AND_CAPS };
}

export function backspace(): Action {
	return { action: BACKSPACE };
}

export function del(): Action {
	return { action: DEL };
}

export function left(): Action {
	return { action: LEFT };
}

export function right(): Action {
	return { action: RIGHT };
}

export function home(): Action {
	return { action: HOME };
}

export function end(): Action {
	return { action: END };
}

export function done(): Action {
	return { action: DONE };
}

export function layout<Name extends string>(name: Name) {
	return function (): Action<Name> {
		return { action: LAYOUT, payload: name };
	};
}
