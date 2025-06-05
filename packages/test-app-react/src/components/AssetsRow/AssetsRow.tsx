import { type FocusEvent, useCallback, useMemo, useState } from 'react';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { List } from '@salik1992/tv-tools-react/list';
import { type ListDataConfiguration } from '../../data';
import { usePagedData } from '../../hooks/usePagedData';
import { AssetsRowDetail } from '../AssetsRowDetail';
import { Performance } from '../Theme';
import { Tile } from '../Tile';
import { H2, P } from '../Typography';
import * as css from './AssetsRow.module.scss';

export const AssetsRow = ({
	id,
	listData,
	showDetail,
	focusOnMount = false,
	onFocus,
}: {
	id?: string;
	listData: ListDataConfiguration;
	showDetail: boolean;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const [focusedIndex, setFocusedIndex] = useState(0);

	const { data, loading, error } = usePagedData(listData);

	const onDataIndex = useCallback(
		(index: number) => {
			setFocusedIndex(index);
		},
		[setFocusedIndex],
	);

	const hasData = useMemo(() => (data[0]?.length ?? 0) > 0, [data[0]]);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance,
			dataLength: data[0]?.length,
			visibleElements: 9,
			config: {
				navigatableElements: 7,
				scrolling: {
					first: Tile.width / 1.3,
					other: Tile.width,
				},
			},
		}),
		[data[0]?.length],
	);

	const renderElement = useCallback(
		({ id, dataIndex, offset, onFocus }: RenderDataElement) => (
			<Tile
				id={id}
				key={id}
				asset={data[0][dataIndex]}
				style={{
					transform: `translateX(${offset}px)`,
				}}
				onFocus={onFocus}
			/>
		),
		[data[0]],
	);

	return (
		<div className={css.wrap} onFocus={onFocus}>
			<H2 className={css.header}>{listData.title}</H2>
			{loading && <P>Loading...</P>}
			{error !== null && data.pages === 0 && (
				<P>There was an error loading the data</P>
			)}
			{!loading && !hasData && (
				<P className={css.placeholder}>Nothing was found.</P>
			)}
			{hasData && (
				<>
					<List
						id={id}
						Implementation={BasicList}
						configuration={listConfiguration}
						renderItem={renderElement}
						focusOnMount={focusOnMount}
						onDataIndex={onDataIndex}
					/>
					<AssetsRowDetail
						visible={showDetail}
						asset={data[0][focusedIndex]}
					/>
				</>
			)}
		</div>
	);
};
