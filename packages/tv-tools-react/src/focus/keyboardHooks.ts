import { useCallback, useEffect } from 'react';
import {
	BACK,
	DOWN,
	ENTER,
	LEFT,
	RIGHT,
	UP,
	type Key,
	type KeyOption,
} from '@salik1992/tv-tools/control';
import {
	type ControlEvent,
	type ControlListener,
	type ControlPhase,
	type ControlType,
	focus,
} from '@salik1992/tv-tools/focus';

type Options = KeyOption & {
	key?: Key;
	type?: ControlType;
	phase?: ControlPhase;
};

export function getUseOnKey(id: string) {
	return function useOnKey(
		listener: ControlListener,
		dependencies: unknown[],
		{
			key,
			type = 'keydown',
			phase = 'bubble',
			ignoreRtl = false,
		}: Options = {},
	) {
		const cachedListener = useCallback(
			(event: ControlEvent) => {
				if (!key || key.is(event, { ignoreRtl })) {
					return listener(event);
				}
				return false;
			},
			[...dependencies, listener, key],
		);

		useEffect(() => {
			focus.addEventListener(id, cachedListener, type, phase);
			return () => {
				focus.removeEventListener(id, cachedListener, type, phase);
			};
		}, [id, cachedListener, type, phase]);
	};
}

export function getUseOnEnter(id: string) {
	return function useOnEnter(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(id)(listener, dependencies, { key: ENTER });
	};
}

export function getUseOnBack(id: string) {
	return function useOnBack(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(id)(listener, dependencies, { key: BACK });
	};
}

export function getUseOnUp(id: string) {
	return function useOnUp(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(id)(listener, dependencies, { key: UP });
	};
}

export function getUseOnDown(id: string) {
	return function useOnDown(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(id)(listener, dependencies, { key: DOWN });
	};
}

export function getUseOnLeft(id: string) {
	return function useOnLeft(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
		{ ignoreRtl }: KeyOption = {},
	) {
		getUseOnKey(id)(listener, dependencies, { key: LEFT, ignoreRtl });
	};
}

export function getUseOnRight(id: string) {
	return function useOnRight(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
		{ ignoreRtl }: KeyOption = {},
	) {
		getUseOnKey(id)(listener, dependencies, { key: RIGHT, ignoreRtl });
	};
}
