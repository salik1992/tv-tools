import { useEffect, useRef, useState } from 'react';
import type {
	BrowseItem,
	ConfigurationFilter,
} from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';

export const useBrowseData = (id: string) => {
	const mounted = useRef(true);
	const dataProvider = useDataProvider();
	const [data, setData] = useState<BrowseItem<ConfigurationFilter>[] | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await dataProvider.getBrowse(id);
				if (mounted.current) {
					setData(data);
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
		})();
	}, [id]);

	return { data, loading, error };
};
