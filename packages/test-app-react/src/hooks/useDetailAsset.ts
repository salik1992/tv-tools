import { useEffect, useRef, useState } from 'react';
import type { AssetMapping, AssetType, Id } from '../data/types';
import { DiscoverTypes } from '../data/tmdbTypes';
import { tmdb } from '../data';

export const useDetailAsset = (type: AssetType, id: Id) => {
	const mounted = useRef(true);
	const [asset, setAsset] = useState<AssetMapping[typeof type] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await tmdb.getDetail(type as DiscoverTypes, id);
				if (!mounted.current) {
					return;
				}
				setAsset(data);
			} catch (e: unknown) {
				setError(e);
			} finally {
				setLoading(false);
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
