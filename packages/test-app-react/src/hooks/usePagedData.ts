import { useCallback, useEffect, useRef, useState } from 'react';
import type { Paged } from '../data/types';

export const usePagedData = <T>(
	rawFetchData: (page: number) => Promise<Paged<T>>,
	dependencies: unknown[],
) => {
	const mounted = useRef(true);
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
			if (!mounted.current) {
				return;
			}
			setData((currentData) => ({
				...currentData,
				...pageData,
			}));
		} catch (e: unknown) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [fetchPage]);

	useEffect(() => {
		fetchNextPage();
	}, []);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	return {
		data,
		fetchNextPage,
		loading,
		error,
	};
};
