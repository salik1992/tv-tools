import { useState } from 'react';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { isMovie, isSeries } from '@salik1992/test-app-data/guards';
import type { MovieAsset, SeriesAsset } from '@salik1992/test-app-data/types';
import {
	validateAssetType,
	validateId,
} from '@salik1992/test-app-data/validations';
import { useDataProvider } from '../data';
import { useAssertedParams } from '../hooks/useAssertedParams';
import { useDetailAsset } from '../hooks/useDetailAsset';
import { DetailMovie } from './DetailMovie';
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

	return (
		<Screen backNavigation="..">
			{loading && (
				<ScreenCentered>
					<H2>Loading...</H2>
				</ScreenCentered>
			)}
			{!!error && (
				<ScreenCentered>
					<H2>There was an error loading the data.</H2>
					<P>Error: {(error as Error)?.message}</P>
				</ScreenCentered>
			)}
			{asset && (
				<VerticalFocus>
					<BackdropImage
						$src={dataProvider.getImageUrl(asset, ['backdrop'], {
							width: 1920,
						})}
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
						</Scroller>
					</InnerWrap>
				</VerticalFocus>
			)}
		</Screen>
	);
};
