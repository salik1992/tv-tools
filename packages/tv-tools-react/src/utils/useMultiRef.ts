import { type RefObject, useEffect, useMemo, useRef } from 'react';

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
