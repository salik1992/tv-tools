import type { RefObject } from 'react';
import { useContext } from 'react';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';

export const ExposeFocusManager = ({
	focusManager,
}: {
	focusManager: RefObject<FocusManager | null>;
}) => {
	const context = useContext(FocusContext);
	if (context.focusManager) {
		focusManager.current = context.focusManager;
	}
	return null;
};

export function assertFocusManager(
	focusManager: RefObject<FocusManager | null>,
): asserts focusManager is RefObject<FocusManager> {
	if (focusManager.current === null) {
		throw new Error('FocusManager is null');
	}
}
