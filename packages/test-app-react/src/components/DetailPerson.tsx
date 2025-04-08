import { type Dispatch, useCallback } from 'react';
import styled from 'styled-components';
import type { PersonAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { AssetsRow } from './AssetsRow';
import { DetailLabel } from './DetailLabel';
import { DetailPoster } from './DetailPoster';
import { Overview } from './Overview';
import { Colors } from './Theme';
import { H1, P, Typography } from './Typography';

const Profession = styled.span`
	color: ${Colors.fg.secondary};
	font-weight: 400;
`;

const indexToScroll = (index: number) => {
	return (index + 1) * (7 * Typography.row);
};

export const DetailPerson = ({
	asset,
	setScroll,
}: {
	asset: PersonAsset;
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
				$src={dataProvider.getImageUrl(asset, ['profile'], {
					width: 200,
				})}
			/>
			<H1>
				{asset.title}
				{asset.profession && (
					<Profession> known for {asset.profession}</Profession>
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
				overview={asset.description}
				onFocus={onOverviewFocus}
				focusOnMount
			/>
			<AssetsRow
				key={`knownFor-${asset.id}`}
				listData={{
					filterBy: 'knownFor',
					type: 'movie',
					title: 'Movies',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={onListFocus(0)}
			/>
			<AssetsRow
				key={`knownFor-${asset.id}`}
				listData={{
					filterBy: 'knownFor',
					type: 'series',
					title: 'Series',
					id: asset.id,
				}}
				showDetail={false}
				onFocus={onListFocus(1)}
			/>
		</>
	);
};
