import { useCallback, useEffect } from 'react';
import {
	BACK,
	DOWN,
	ENTER,
	type Key,
	type KeyOption,
	LEFT,
	RIGHT,
	UP,
} from '@salik1992/tv-tools/control';
import type {
	ControlEvent,
	ControlListener,
	ControlPhase,
	ControlType,
	FocusManager,
} from '@salik1992/tv-tools/focus';

type Options = KeyOption & {
	key?: Key;
	type?: ControlType;
	phase?: ControlPhase;
};

export function getUseOnKey(focusManager: FocusManager, id: string) {
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
			focusManager.addEventListener(id, cachedListener, type, phase);
			return () => {
				focusManager.removeEventListener(
					id,
					cachedListener,
					type,
					phase,
				);
			};
		}, [id, cachedListener, type, phase]);
	};
}

export function getUseOnEnter(focusManager: FocusManager, id: string) {
	return function useOnEnter(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, { key: ENTER });
	};
}

export function getUseOnBack(focusManager: FocusManager, id: string) {
	return function useOnBack(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, { key: BACK });
	};
}

export function getUseOnUp(focusManager: FocusManager, id: string) {
	return function useOnUp(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, { key: UP });
	};
}

export function getUseOnDown(focusManager: FocusManager, id: string) {
	return function useOnDown(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, { key: DOWN });
	};
}

export function getUseOnLeft(focusManager: FocusManager, id: string) {
	return function useOnLeft(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
		{ ignoreRtl }: KeyOption = {},
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, {
			key: LEFT,
			ignoreRtl,
		});
	};
}

export function getUseOnRight(focusManager: FocusManager, id: string) {
	return function useOnRight(
		listener: ControlListener,
		dependencies: unknown[] = [listener],
		{ ignoreRtl }: KeyOption = {},
	) {
		getUseOnKey(focusManager, id)(listener, dependencies, {
			key: RIGHT,
			ignoreRtl,
		});
	};
}
