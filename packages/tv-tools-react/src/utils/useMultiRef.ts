import { type RefObject, useEffect, useMemo, useRef } from 'react';

/**
 * useMultiRef is a custom hook that creates a single ref and assigns it to multiple refs.
 * @param refs - An array of refs to assign the same value to. The values can be undefined.
 * @example
 * ```typescript
 * const inputRef = useRef(null);
 * const multiRef = useMultiRef(inputRef, props.inputRef);
 * ...
 * <input ref={multiRef} />
 * ```
 */
export function useMultiRef<T>(
	...refs: (RefObject<T | null> | undefined)[]
): RefObject<T | null> {
	const ref = useRef<T>(null);
	const memoizedRefs = useMemo(() => refs, refs);

	useEffect(() => {
		refs.forEach((r) => {
			if (r) {
				r.current = ref.current;
			}
		});
	}, [memoizedRefs, ref.current]);

	return ref;
}
