import { useCallback, useEffect, useRef, useState } from 'react';
import type { Paged } from '../data/types';

export const usePagedData = <T>(
	rawFetchData: (page: number) => Promise<Paged<T>>,
	dependencies: unknown[],
) => {
	const [data, setData] = useState<Paged<T>>({ pages: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);
	const fetchedPages = useRef<number>(0);
	const requestedPages = useRef<number>(0);

	const fetchPage = useCallback(rawFetchData, dependencies);

	const fetchNextPage = useCallback(async () => {
		if (requestedPages.current !== fetchedPages.current) {
			return;
		}
		requestedPages.current += 1;
		try {
			const pageData = await fetchPage(requestedPages.current);
			setData((currentData) => ({
				...currentData,
				...pageData,
			}));
			setLoading(false);
		} catch (e: unknown) {
			setError(e);
		}
	}, [fetchPage]);

	useEffect(() => {
		fetchNextPage();
	}, []);

	return {
		data,
		fetchNextPage,
		loading,
		error,
	};
};
