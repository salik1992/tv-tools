import { type Dispatch, useCallback } from 'react';
import styled from 'styled-components';
import type { MovieAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { DetailLabel } from './DetailLabel';
import { DetailRating } from './DetailRating';
import { Overview } from './Overview';
import { H1, P, Typography } from './Typography';

const Poster = styled.div.attrs<{ $src: string | null }>(({ $src }) => ({
	style: { backgroundImage: `url(${$src})` },
}))`
	position: absolute;
	top: ${Typography.row}px;
	right: ${Typography.row}px;
	width: ${13 * Typography.column}px;
	height: ${12 * Typography.row}px;
	background-size: cover;
	background-position: center center;
`;

export const DetailMovie = ({
	asset,
	setScroll,
}: {
	asset: MovieAsset;
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
			<P>
				<DetailLabel>Released: </DetailLabel>
				{new Date(asset.releaseDate).getFullYear()}{' '}
				{asset.countries && (
					<DetailLabel>
						(
						{asset.countries
							.map((c) => c.iso_3166_1.toUpperCase())
							.join(', ')}
						)
					</DetailLabel>
				)}
			</P>
			<DetailRating asset={asset} />
			<br />
			<Overview
				overview={asset.description}
				onFocus={onOverviewFocus}
				focusOnMount
			/>
		</>
	);
};
