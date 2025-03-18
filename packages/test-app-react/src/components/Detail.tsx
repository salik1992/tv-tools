import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import type {
	AssetType,
	Id,
	MovieAsset,
	SeriesAsset,
} from '@salik1992/test-app-data/types';
import { isMovie, isSeries } from '@salik1992/test-app-data/guards';
import { useDetailAsset } from '../hooks/useDetailAsset';
import { Button } from './Button';
import { DetailMovie } from './DetailMovie';
import { DetailSeries } from './DetailSeries';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { H2, P, Typography } from './Typography';
import { useDataProvider } from '../data';
import { Border, Colors, Transition } from './Theme';

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

type Params = { type: AssetType; id: Id };

function assertParams(params: Partial<Params>): asserts params is Params {
	if (params.id === undefined) {
		throw new Error('Missing "id" parameter');
	}
	if (params.type === undefined) {
		throw new Error('Missing "type" parameter');
	}
}

export const Detail = () => {
	const params = useParams<Params>();
	assertParams(params);
	const { type, id } = params;

	const dataProvider = useDataProvider();

	const { asset, loading, error } = useDetailAsset(type, id);

	const [scroll, setScroll] = useState(0);

	const navigate = useNavigate();

	const onBack = useCallback(() => {
		navigate(-1);
		return true;
	}, [navigate]);

	return (
		<Screen>
			{loading && (
				<ScreenCentered>
					<H2>Loading...</H2>
					<br />
					<Button onPress={onBack} focusOnMount>
						Back
					</Button>
				</ScreenCentered>
			)}
			{!!error && (
				<ScreenCentered>
					<H2>There was an error loading the data.</H2>
					<P>Error: {(error as Error)?.message}</P>
					<br />
					<Button onPress={onBack} focusOnMount>
						Back
					</Button>
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
