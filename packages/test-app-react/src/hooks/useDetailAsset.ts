import { useEffect, useRef, useState } from 'react';
import type {
	AssetMapping,
	AssetType,
	Id,
} from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';

export const useDetailAsset = (type: AssetType, id: Id) => {
	const mounted = useRef(true);
	const dataProvider = useDataProvider();
	const [asset, setAsset] = useState<AssetMapping[typeof type] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await dataProvider.getAsset(type, id);
				if (mounted.current) {
					setAsset(data);
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
	}, [type, id]);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	return { asset, loading, error };
};
