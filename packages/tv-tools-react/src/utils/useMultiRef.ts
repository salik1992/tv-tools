import { type RefObject, useEffect, useRef } from 'react';

export function useMultiRef<T>(
	...refs: (RefObject<T | null> | undefined)[]
): RefObject<T | null> {
	const ref = useRef<T>(null);

	useEffect(() => {
		refs.forEach((r) => {
			if (r) {
				r.current = ref.current;
			}
		});
	}, [refs, ref.current]);

	return ref;
}
