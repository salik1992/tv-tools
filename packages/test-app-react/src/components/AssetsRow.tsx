import { useMemo } from 'react';
import styled from 'styled-components';
import type { DiscoverTypes } from '../data/tmdbTypes';
import { tmdb } from '../data';
import { usePagedData } from '../hooks/usePagedData';
import { Tile } from './Tile';

const Wrap = styled.div`
	margin-top: 15px;
`;

const P = styled.p`
	text-align: center;
`;

export const AssetsRow = ({
	list,
	header,
}: {
	list: { from: 'discover'; type: DiscoverTypes };
	header: string;
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
				<ul>
					{data[1].map((asset) => (
						<Tile asset={asset} key={asset.id} />
					))}
				</ul>
			)}
		</Wrap>
	);
};
