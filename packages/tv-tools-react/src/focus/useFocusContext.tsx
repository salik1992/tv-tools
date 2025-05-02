import { useContext } from 'react';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';
import type { Focus } from './types';

export function useFocusContext() {
	const context = useContext(FocusContext);
	if (!context.focusManager) {
		throw new Error('useFocusContext must be used within a FocusProvider');
	}
	return context as {
		focusManager: FocusManager;
		addChild: Focus['addChild'];
	};
}
