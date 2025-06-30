import { type FocusEvent, useCallback, useMemo } from 'react';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { List } from '@salik1992/tv-tools-react/list';
import type { Asset, AssetDescription } from '@salik1992/test-app-data/types';
import { type ListDataConfiguration } from '../../data';
import { usePagedData } from '../../hooks/usePagedData';
import { Hero } from '../Hero';
import { Performance } from '../Theme';
import { H3 } from '../Typography';
import * as css from './HeroRow.module.scss';

export const HeroRow = ({
	id,
	listData,
	focusOnMount = false,
	showAll = false,
	onFocus,
}: {
	id?: string;
	listData: ListDataConfiguration;
	showAll?: boolean;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const { data, pages, loading, error } = usePagedData(listData, {
		appendShowAll: showAll,
	});

	const listConfiguration = useMemo(
		() => ({
			performance: Performance,
			visibleElements: 5,
			config: {
				navigatableElements: 2,
				scrolling: {
					first: Hero.width,
					other: Hero.width,
				},
			},
		}),
		[],
	);

	const renderElement = useCallback(
		({
			id,
			item,
			offset,
			onFocus,
		}: RenderDataElement<Asset & AssetDescription>) => (
			<Hero
				id={id}
				key={id}
				asset={item}
				style={{
					transform: `translateX(${offset}px)`,
				}}
				onFocus={onFocus}
			/>
		),
		[],
	);

	return (
		<div className={css.wrap} onFocus={onFocus}>
			{loading && <H3 className={css.text}>Loading...</H3>}
			{error !== null && pages === 0 && (
				<H3 className={css.text}>
					There was an error loading the data.
				</H3>
			)}
			{!loading && !error && !data.length && (
				<H3 className={css.text}>Nothing was found.</H3>
			)}
			{data.length && (
				<>
					<List
						id={id}
						Implementation={BasicList}
						configuration={listConfiguration}
						renderItem={renderElement}
						data={data}
						focusOnMount={focusOnMount}
					/>
				</>
			)}
		</div>
	);
};
