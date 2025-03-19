import { useEffect, useRef, useState } from 'react';
import { ns } from '@salik1992/tv-tools/logger';
import type { MenuItem } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';

const logger = ns('useMenuItems');

export const useMenuItems = () => {
	const mounted = useRef(true);
	const dataProvider = useDataProvider();
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const data = await dataProvider.getMenu();
				if (mounted.current) {
					setMenuItems(data);
				}
			} catch (e: unknown) {
				logger.error(e);
				if (mounted.current) {
					setMenuItems([]);
				}
			}
		})();
	}, [setMenuItems, dataProvider]);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	return menuItems;
};
