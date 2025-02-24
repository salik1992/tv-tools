export type FocusFunction = (options?: FocusOptions) => void;

export type ControlEvent = {
	target: EventTarget;
	keyCode?: number;
	code?: string;
	preventDefault: () => void;
	stopPropagation: () => void;
};

export type ControlListener = <T extends ControlEvent>(key: T) => boolean;

export type ControlType = 'keydown' | 'keyup';

export type ControlPhase = 'capture' | 'bubble';
