import { type FocusEvent, useCallback, useMemo } from 'react';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { List } from '@salik1992/tv-tools-react/list';
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
	onFocus,
}: {
	id?: string;
	listData: ListDataConfiguration;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const { data, loading, error } = usePagedData(listData);

	const hasData = useMemo(() => (data[0]?.length ?? 0) > 0, [data[0]]);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance,
			dataLength: data[0]?.length,
			visibleElements: 5,
			config: {
				navigatableElements: 2,
				scrolling: {
					first: Hero.width,
					other: Hero.width,
				},
			},
		}),
		[data[0]?.length],
	);

	const renderElement = useCallback(
		({ id, dataIndex, offset, onFocus }: RenderDataElement) => (
			<Hero
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
			{loading && <H3 className={css.text}>Loading...</H3>}
			{error !== null && data.pages === 0 && (
				<H3 className={css.text}>
					There was an error loading the data.
				</H3>
			)}
			{!loading && !error && !hasData && (
				<H3 className={css.text}>Nothing was found.</H3>
			)}
			{hasData && (
				<>
					<List
						id={id}
						Implementation={BasicList}
						configuration={listConfiguration}
						renderItem={renderElement}
						focusOnMount={focusOnMount}
					/>
				</>
			)}
		</div>
	);
};
