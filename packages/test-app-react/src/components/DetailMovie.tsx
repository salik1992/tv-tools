import type { MovieAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { AssetsRow } from './AssetsRow';
import { DetailLabel } from './DetailLabel';
import { DetailPoster } from './DetailPoster';
import { DetailRating } from './DetailRating';
import { Overview } from './Overview';
import { H1, P, Typography } from './Typography';

export const DetailMovie = ({
	asset,
	scroll,
}: {
	asset: MovieAsset;
	scroll: (px: number) => () => void;
}) => {
	const dataProvider = useDataProvider();

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
				onFocus={scroll(0)}
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
				onFocus={scroll(7 * Typography.row)}
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
				onFocus={scroll(14 * Typography.row)}
			/>
		</>
	);
};
