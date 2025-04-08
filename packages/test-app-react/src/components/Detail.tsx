import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { isMovie, isPerson, isSeries } from '@salik1992/test-app-data/guards';
import type {
	MovieAsset,
	PersonAsset,
	SeriesAsset,
} from '@salik1992/test-app-data/types';
import {
	validateAssetType,
	validateId,
} from '@salik1992/test-app-data/validations';
import { useDataProvider } from '../data';
import { useAssertedParams } from '../hooks/useAssertedParams';
import { useDetailAsset } from '../hooks/useDetailAsset';
import { Button } from './Button';
import { DetailMovie } from './DetailMovie';
import { DetailPerson } from './DetailPerson';
import { DetailSeries } from './DetailSeries';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { Border, Colors, Transition } from './Theme';
import { H2, P, Typography } from './Typography';

const BackdropImage = styled.div.attrs<{ $src: string | null }>(({ $src }) => ({
	style: { backgroundImage: `url(${$src})` },
}))`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 1080px;
	background-size: cover;
	background-position: center center;
`;

const Scroller = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: ${Typography.row}px;
	${Transition('transform')}
`;

const InnerWrap = styled.div`
	position: absolute;
	left: ${Typography.row}px;
	right: ${Typography.row}px;
	bottom: ${Typography.row}px;
	height: ${15 * Typography.row}px;
	${Border}
	border-style: solid;
	border-color: ${Colors.fg.primary};
	background-color: ${Colors.bg.opaque};
	overflow: hidden;
`;

export const Detail = () => {
	const { assetId, assetType } = useAssertedParams({
		assetId: validateId,
		assetType: validateAssetType,
	});

	const dataProvider = useDataProvider();

	const { asset, loading, error } = useDetailAsset(assetType, assetId);

	const [scroll, setScroll] = useState(0);

	const navigate = useNavigate();
	const back = useCallback(() => {
		navigate(-1);
		return true;
	}, [navigate]);

	return (
		<Screen backNavigation={-1}>
			{loading && (
				<ScreenCentered>
					<H2>Loading...</H2>
				</ScreenCentered>
			)}
			{!!error && (
				<ScreenCentered>
					<H2>There was an error loading the data.</H2>
					<P>Error: {(error as Error)?.message}</P>
					<Button onPress={back} focusOnMount>
						Back
					</Button>
				</ScreenCentered>
			)}
			{asset && (
				<VerticalFocus>
					<BackdropImage
						$src={dataProvider.getImageUrl(
							asset,
							['backdrop', 'still', 'poster', 'profile'],
							{
								width: 1920,
							},
						)}
					/>
					<InnerWrap>
						<Scroller
							style={{ transform: `translateY(-${scroll}px)` }}
						>
							{isMovie(asset) && (
								<DetailMovie
									asset={asset as MovieAsset}
									setScroll={setScroll}
								/>
							)}
							{isSeries(asset) && (
								<DetailSeries
									asset={asset as SeriesAsset}
									setScroll={setScroll}
								/>
							)}
							{isPerson(asset) && (
								<DetailPerson
									asset={asset as PersonAsset}
									setScroll={setScroll}
								/>
							)}
						</Scroller>
					</InnerWrap>
				</VerticalFocus>
			)}
		</Screen>
	);
};
