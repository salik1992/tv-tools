import { useCallback, type Dispatch } from 'react';
import styled from 'styled-components';
import type { SeriesAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { H1, P } from './Typography';
import { Overview } from './Overview';

const Poster = styled.div.attrs<{ $src: string | null }>(({ $src }) => ({
	style: { backgroundImage: `url(${$src})` },
}))`
	position: absolute;
	top: 0;
	right: 0;
	width: 200px;
	height: 356px;
	background-size: cover;
	background-position: center center;
`;

export const DetailSeries = ({
	asset,
	setScroll,
}: {
	asset: SeriesAsset;
	setScroll: Dispatch<number>;
}) => {
	const dataProvider = useDataProvider();

	const onOverviewFocus = useCallback(() => setScroll(0), [setScroll]);

	return (
		<>
			<Poster
				$src={dataProvider.getImageUrl(asset, ['poster'], {
					width: 200,
				})}
			/>
			<H1>{asset.title}</H1>
			<P>First aired: {new Date(asset.releaseDate).getFullYear()}</P>
			{asset.rating && (
				<P>
					Rating: {asset.rating.value}
					{asset.rating.unit}
					{asset.rating.votes && ` (${asset.rating.votes} votes)`}
				</P>
			)}
			<br />
			<Overview
				overview={asset.description}
				onFocus={onOverviewFocus}
				focusOnMount
			/>
		</>
	);
};
