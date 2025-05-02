import { useCallback, useEffect, useMemo } from 'react';
import type { Key } from '@salik1992/tv-tools/control';
import { useFocusManager } from './useFocusManager';

/**
 * Hook for listening to key sequences. Ideal for hidden shortcuts
 * like opening various devtools.
 *
 * @param sequence - sequence of keys to trigger the listener
 * It can be inlined, the memoization happens internally.
 * @param listener - function that  is run when the sequence occurs
 * It can be inlined, storing as callback happens internally.
 * @param dependencies - dependencies for the listener callback
 *
 * @example
 * ```typescriptreact
 * useKeySequenceListener([RED, YELLOW, GREEN, BLUE, YELLOW], () => {
 *     if (!devtoolsVisible) {
 *         dispatch(setDevtoolsVisible(true))
 *     }
 * }, [dispatch, devtoolsVisible])
 * ```
 */
export function useKeySequenceListener(
	sequence: Key[],
	listener: () => void,
	dependencies: unknown[],
) {
	const focusManager = useFocusManager();
	const memoizedSequence = useMemo(
		() => sequence,
		[sequence.map((key) => `${key}`).join(',')],
	);

	const memoizedListener = useCallback(listener, dependencies);

	useEffect(() => {
		focusManager.addKeySequenceListener(memoizedSequence, memoizedListener);
		return () => {
			focusManager.removeKeySequenceListener(memoizedSequence);
		};
	}, [memoizedSequence, listener]);
}
