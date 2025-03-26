import { useCallback, useEffect, useRef, useState } from 'react';
import type { Paged } from '@salik1992/test-app-data/types';
import { type ListDataConfiguration, useDataProvider } from '../data';

export const usePagedData = (listData: ListDataConfiguration) => {
	const mounted = useRef(true);
	const dataProvider = useDataProvider();
	const [data, setData] = useState<Paged<(typeof listData)['pageItemType']>>({
		pages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);
	const fetchedPages = useRef<number>(0);
	const requestedPages = useRef<number>(0);

	const fetchNextPage = useCallback(async () => {
		if (requestedPages.current !== fetchedPages.current) {
			return;
		}
		requestedPages.current += 1;
		try {
			const pageData = await dataProvider.getPagedAssets(
				listData,
				requestedPages.current - 1,
			);
			if (mounted.current) {
				setData((currentData) => ({
					...currentData,
					...pageData,
				}));
			}
		} catch (e: unknown) {
			if (mounted.current) {
				setError(e);
			}
		} finally {
			if (mounted.current) {
				setLoading(false);
			}
		}
	}, [dataProvider]);

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
