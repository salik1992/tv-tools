import { type Dispatch, useCallback } from 'react';
import styled from 'styled-components';
import type { SeriesAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { AssetsRow } from './AssetsRow';
import { DetailPoster } from './DetailPoster';
import { DetailRating } from './DetailRating';
import { Overview } from './Overview';
import { Colors } from './Theme';
import { H1, P, Typography } from './Typography';

const Label = styled.span`
	color: ${Colors.fg.secondary};
`;

const indexToScroll = (index: number) => {
	return (index + 1) * (7 * Typography.row);
};

export const DetailSeries = ({
	asset,
	setScroll,
}: {
	asset: SeriesAsset;
	setScroll: Dispatch<number>;
}) => {
	const dataProvider = useDataProvider();

	const onOverviewFocus = useCallback(() => setScroll(0), [setScroll]);

	const onListFocus = useCallback(
		(listIndex: number) => () => {
			setScroll(indexToScroll(listIndex));
		},
		[setScroll],
	);

	return (
		<>
			<DetailPoster
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
			<AssetsRow
				key={`castAndCrew-${asset.id}`}
				listData={{
					filterBy: 'castAndCrew',
					type: 'series',
					title: 'Cast & Crew',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={onListFocus(0)}
			/>
			<AssetsRow
				key={`related-${asset.id}`}
				listData={{
					filterBy: 'related',
					type: 'series',
					title: 'You might also like',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={onListFocus(1)}
			/>
		</>
	);
};
