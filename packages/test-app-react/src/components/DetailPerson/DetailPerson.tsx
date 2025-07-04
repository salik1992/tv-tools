import type { PersonAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../../data';
import { AssetsRow } from '../AssetsRow';
import { DetailLabel } from '../DetailLabel';
import { DetailPoster } from '../DetailPoster';
import { Overview } from '../Overview';
import { H1, P, ROW } from '../Typography';
import * as css from './DetailPerson.module.scss';

export const DetailPerson = ({
	asset,
	scroll,
}: {
	asset: PersonAsset;
	scroll: (px: number) => () => void;
}) => {
	const dataProvider = useDataProvider();

	return (
		<>
			<DetailPoster
				$src={dataProvider.getImageUrl(asset, ['profile'], {
					width: 200,
				})}
			/>
			<H1>
				{asset.title}
				{asset.profession && (
					<span className={css.profession}>
						{' '}
						known for {asset.profession}
					</span>
				)}
			</H1>
			<br />
			<P>
				{asset.birth && (
					<DetailLabel>
						{asset.origin && (
							<>
								{asset.origin}
								<br />
							</>
						)}
						{asset.birth ? asset.birth.toLocaleDateString() : ''}
						{asset.death
							? ` - ${asset.death.toLocaleDateString()}`
							: ''}
					</DetailLabel>
				)}
			</P>
			<br />
			<Overview
				key={`overview-${asset.type}-${asset.id}`}
				overview={asset.description}
				onFocus={scroll(0)}
				focusOnMount
			/>
			<AssetsRow
				key={`knownFor-movies-${asset.id}`}
				listData={{
					filterBy: 'knownFor',
					type: 'movie',
					title: 'Movies',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={scroll(7 * ROW)}
				paginate
			/>
			<AssetsRow
				key={`knownFor-series-${asset.id}`}
				listData={{
					filterBy: 'knownFor',
					type: 'series',
					title: 'Series',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={scroll(14 * ROW)}
				paginate
			/>
		</>
	);
};
