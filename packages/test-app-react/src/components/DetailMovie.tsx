import { type Dispatch, useCallback } from 'react';
import type { MovieAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { AssetsRow } from './AssetsRow';
import { DetailLabel } from './DetailLabel';
import { DetailPoster } from './DetailPoster';
import { DetailRating } from './DetailRating';
import { Overview } from './Overview';
import { H1, P, Typography } from './Typography';

const indexToScroll = (index: number) => {
	return (index + 1) * (7 * Typography.row);
};

export const DetailMovie = ({
	asset,
	setScroll,
}: {
	asset: MovieAsset;
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
			<AssetsRow
				key={`castAndCrew-${asset.id}`}
				listData={{
					filterBy: 'castAndCrew',
					type: 'movie',
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
					type: 'movie',
					title: 'You might also like',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={onListFocus(1)}
			/>
		</>
	);
};
