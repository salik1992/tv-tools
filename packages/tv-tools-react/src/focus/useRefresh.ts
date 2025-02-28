import { useCallback, useState } from 'react';

/**
 * Forces refresh of the subtree. This may be required
 * if there is a new focus child appearing in the middle
 * of children outside of normal lifecycle. For example
 * encapsulated component rendering the element only after
 * fetching its data.
 *
 * Call refresh to run the update of children and use it in
 * a dependency array to refresh context value.
 */
export function useRefresh() {
	const [loop, setLoop] = useState(0);

	const refresh = useCallback(() => {
		setLoop((old) => old + 1);
	}, [loop]);

	return refresh;
}
