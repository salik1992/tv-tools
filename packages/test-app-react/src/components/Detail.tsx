import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { useDetailAsset } from '../hooks/useDetailAsset';
import { H2, P } from './Typography';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { AssetType, Id } from '../data/types';
import { tmdb } from '../data';
import { isMovie, isSeries } from '../data/guards';
import { DetailMovie } from './DetailMovie';
import { useCallback, useState } from 'react';
import { Button } from './Button';
import { DetailSeries } from './DetailSeries';

const BackdropImage = styled.div.attrs<{ $src: string }>(({ $src }) => ({
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

const BackdropShadow = styled.div`
	position: absolute;
	top: 680px;
	left: 0;
	width: 100%;
	height: 400px;
	background-image: linear-gradient(to bottom, transparent, #22222f);
`;

const Scroller = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 0 40px;
	height: 1080px;
	transition: transform 300ms;
`;

const InnerWrap = styled.div`
	position: relative;
	margin-top: 550px;
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

	const { asset, loading, error } = useDetailAsset(type, id);

	const [scroll, setScroll] = useState(0);

	const navigate = useNavigate();

	const onBack = useCallback(() => {
		navigate(-1);
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
				<Scroller style={{ transform: `translateY(-${scroll}px)` }}>
					<VerticalFocus>
						<BackdropImage
							$src={tmdb.getImage(asset, 'backdrop', 1920)}
						/>
						<BackdropShadow />
						<InnerWrap>
							{isMovie(asset) && (
								<DetailMovie
									asset={asset}
									setScroll={setScroll}
								/>
							)}
							{isSeries(asset) && (
								<DetailSeries
									asset={asset}
									setScroll={setScroll}
								/>
							)}
						</InnerWrap>
					</VerticalFocus>
				</Scroller>
			)}
		</Screen>
	);
};
