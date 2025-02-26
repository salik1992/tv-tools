import { useMemo } from 'react';
import styled from 'styled-components';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { List } from '@salik1992/tv-tools-react/list';
import type { DiscoverTypes } from '../data/tmdbTypes';
import { tmdb } from '../data';
import { usePagedData } from '../hooks/usePagedData';
import { Tile } from './Tile';

const Wrap = styled.div`
	margin-top: 15px;
	.list {
		white-space: nowrap;
		overflow: hideen;
	}
	.list-inner-wrap {
		transition: transform 300ms;
	}
`;

const P = styled.p`
	text-align: center;
`;

export const AssetsRow = ({
	list,
	header,
	focusOnMount = false,
}: {
	list: { from: 'discover'; type: DiscoverTypes };
	header: string;
	focusOnMount?: boolean;
}) => {
	const fetchFunction = useMemo(() => {
		return list.type === 'movie'
			? (page: number) => tmdb.getDiscover('movie', page)
			: (page: number) => tmdb.getDiscover('tv', page);
	}, [list]);

	const { data, loading, error } = usePagedData(fetchFunction, [list]);

	return (
		<Wrap>
			<h2>{header}</h2>
			{loading && <P>Loading...</P>}
			{error !== null && data.pages === 0 && (
				<P>There was an error loading the data</P>
			)}
			{!loading && (data[1]?.length ?? 0) === 0 && (
				<P>Nothing was found.</P>
			)}
			{data[1]?.length > 0 && (
				<List
					Implementation={BasicList}
					configuration={{
						performance: Performance.ANIMATED,
						dataLength: data[1].length,
						visibleElements: 9,
						navigatableElements: 7,
						config: {
							scrolling: {
								first: 135,
								other: 270,
							},
						},
					}}
					renderItem={({
						id,
						dataIndex,
						offset,
					}: RenderDataElement) => (
						<Tile
							id={id}
							key={id}
							asset={data[1][dataIndex]}
							style={{
								transform: `translateX(${offset}px)`,
							}}
						/>
					)}
					focusOnMount={focusOnMount}
				/>
			)}
		</Wrap>
	);
};
