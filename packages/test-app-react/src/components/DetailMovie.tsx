import { useCallback, type Dispatch } from 'react';
import styled from 'styled-components';
import { tmdb } from '../data';
import type { MovieAsset } from '../data/types';
import { H1, P } from './Typography';
import { Overview } from './Overview';

const Poster = styled.div.attrs<{ $src: string }>(({ $src }) => ({
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

export const DetailMovie = ({
	asset,
	setScroll,
}: {
	asset: MovieAsset;
	setScroll: Dispatch<number>;
}) => {
	const onOverviewFocus = useCallback(() => setScroll(0), [setScroll]);

	return (
		<>
			<Poster $src={tmdb.getImage(asset, 'poster', 200)} />
			<H1>{asset.title}</H1>
			<P>
				{new Date(asset.releaseDate).getFullYear()}{' '}
				{asset.countries &&
					`(${asset.countries.map((c) => c.iso_3166_1.toUpperCase()).join(', ')})`}
			</P>
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
