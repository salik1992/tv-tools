import { useCallback, type Dispatch } from 'react';
import styled from 'styled-components';
import type { SeriesAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { DetailRating } from './DetailRating';
import { Overview } from './Overview';
import { Colors } from './Theme';
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

const Label = styled.span`
	color: ${Colors.fg.secondary};
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
			<P>
				<Label>First aired: </Label>
				{new Date(asset.releaseDate).getFullYear()}
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
