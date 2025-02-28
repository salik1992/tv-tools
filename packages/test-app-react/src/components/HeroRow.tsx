import { useCallback, useMemo, type FocusEvent } from 'react';
import styled from 'styled-components';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { List } from '@salik1992/tv-tools-react/list';
import type {
	DiscoverTypes,
	TrendingTimeWindow,
	TrendingTypes,
} from '../data/tmdbTypes';
import { tmdb } from '../data';
import { usePagedData } from '../hooks/usePagedData';
import { Hero } from './Hero';
import { H3 } from './Typography';

const Wrap = styled.div`
	margin-top: 15px;
	margin-left: 50px;
	.list {
		white-space: nowrap;
		padding: 50px 0;
		box-sizing: border-box;
	}
	.list-inner-wrap {
		transition: transform 300ms;
	}
`;

const P = styled(H3)`
	text-align: center;
	height: ${Hero.height}px;
	line-height: ${Hero.height}px;
	vertical-align: middle;
`;

export const HeroRow = ({
	id,
	list,
	focusOnMount = false,
	onFocus,
}: {
	id?: string;
	list:
		| { from: 'discover'; type: DiscoverTypes }
		| {
				from: 'trending';
				type: TrendingTypes;
				timeWindow: TrendingTimeWindow;
		  };
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const fetchFunction = useMemo(() => {
		switch (list.from) {
			case 'discover':
				return (page: number) => tmdb.getDiscover(list.type, page);
			case 'trending':
				return () => tmdb.getTrending(list.type, list.timeWindow);
			default:
				return async () => ({ pages: 0, [0]: [] });
		}
	}, [list]);

	const { data, loading, error } = usePagedData(fetchFunction, [list]);

	const hasData = useMemo(() => (data[1]?.length ?? 0) > 0, [data[1]]);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance.ANIMATED,
			dataLength: data[1]?.length,
			visibleElements: 5,
			navigatableElements: 2,
			config: {
				scrolling: {
					first: Hero.width,
					other: Hero.width,
				},
			},
		}),
		[data[1]?.length],
	);

	const renderElement = useCallback(
		({ id, dataIndex, offset, onFocus }: RenderDataElement) => (
			<Hero
				id={id}
				key={id}
				asset={data[1][dataIndex]}
				style={{
					transform: `translateX(${offset}px)`,
				}}
				onFocus={onFocus}
			/>
		),
		[data[1]],
	);

	return (
		<Wrap onFocus={onFocus}>
			{loading && <P>Loading...</P>}
			{error !== null && data.pages === 0 && (
				<P>There was an error loading the data.</P>
			)}
			{!loading && !error && !hasData && <P>Nothing was found.</P>}
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
		</Wrap>
	);
};
