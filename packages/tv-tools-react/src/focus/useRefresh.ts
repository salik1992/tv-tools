import { useCallback, useState } from 'react';

export function useRefresh() {
	const [now, setNow] = useState(Date.now());

	const refresh = useCallback(() => {
		setNow(Date.now());
	}, [now]);

	return refresh;
}
