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

export const DetailSeries = ({
	asset,
	scroll,
}: {
	asset: SeriesAsset;
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
				<Label>First aired: </Label>
				{new Date(asset.releaseDate).getFullYear()}
			</P>
			<DetailRating asset={asset} />
			<br />
			<Overview
				key={`overview-${asset.type}-${asset.id}`}
				overview={asset.description}
				onFocus={scroll(0)}
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
				onFocus={scroll(7 * Typography.row)}
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
				onFocus={scroll(14 * Typography.row)}
			/>
		</>
	);
};
