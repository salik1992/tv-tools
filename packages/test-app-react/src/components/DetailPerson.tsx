import { type Dispatch, useCallback } from 'react';
import styled from 'styled-components';
import type { PersonAsset } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../data';
import { DetailLabel } from './DetailLabel';
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

const Profession = styled.span`
	color: ${Colors.fg.secondary};
	font-weight: 400;
`;

export const DetailPerson = ({
	asset,
	setScroll,
}: {
	asset: PersonAsset;
	setScroll: Dispatch<number>;
}) => {
	const dataProvider = useDataProvider();

	const onOverviewFocus = useCallback(() => setScroll(0), [setScroll]);

	return (
		<>
			<Poster
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
						{asset.death ? asset.death.toLocaleDateString() : ''}
					</DetailLabel>
				)}
			</P>
			<br />
			<Overview
				overview={asset.description}
				onFocus={onOverviewFocus}
				focusOnMount
			/>
		</>
	);
};
