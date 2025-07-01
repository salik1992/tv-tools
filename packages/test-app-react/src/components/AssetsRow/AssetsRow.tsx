import { type FocusEvent, useCallback, useMemo, useState } from 'react';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { List } from '@salik1992/tv-tools-react/list';
import type { Asset } from '@salik1992/test-app-data/types';
import { type ListDataConfiguration } from '../../data';
import { usePagedData } from '../../hooks/usePagedData';
import { AssetsRowDetail } from '../AssetsRowDetail';
import { Performance } from '../Theme';
import { Tile } from '../Tile';
import { H2, P } from '../Typography';
import * as css from './AssetsRow.module.scss';

const PAGINATION_OFFSET = 3;

export const AssetsRow = ({
	id,
	listData,
	showDetail,
	focusOnMount = false,
	onFocus,
	paginate = false,
	showAll = false,
}: {
	id?: string;
	listData: ListDataConfiguration;
	showDetail: boolean;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
	paginate?: boolean;
	showAll?: boolean;
}) => {
	const [focusedIndex, setFocusedIndex] = useState(0);

	const { data, pages, loading, error, fetchNextPage } = usePagedData(
		listData,
		{ appendShowAll: showAll },
	);

	const onDataIndex = useCallback(
		(index: number) => {
			setFocusedIndex(index);
			if (paginate && index + PAGINATION_OFFSET >= data.length) {
				fetchNextPage();
			}
		},
		[setFocusedIndex, data, fetchNextPage, paginate],
	);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance,
			visibleElements: 9,
			config: {
				navigatableElements: 7,
				scrolling: {
					first: Tile.width / 1.3,
					other: Tile.width,
				},
			},
		}),
		[],
	);

	const renderElement = useCallback(
		({ id, item, offset, onFocus }: RenderDataElement<Asset>) => (
			<Tile
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
			<H2 className={css.header}>{listData.title}</H2>
			{loading && <P>Loading...</P>}
			{error !== null && pages === 0 && (
				<P>There was an error loading the data</P>
			)}
			{!loading && !data.length && (
				<P className={css.placeholder}>Nothing was found.</P>
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
						onDataIndex={onDataIndex}
					/>
					<AssetsRowDetail
						visible={showDetail}
						asset={data[focusedIndex]}
					/>
				</>
			)}
		</div>
	);
};
