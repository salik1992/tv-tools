import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useDataProvider } from '../../data';
import { useAssertedParams } from '../../hooks/useAssertedParams';
import { useDetailAsset } from '../../hooks/useDetailAsset';
import { Button } from '../Button';
import { DetailMovie } from '../DetailMovie';
import { DetailPerson } from '../DetailPerson';
import { DetailSeries } from '../DetailSeries';
import { Screen } from '../Screen';
import { ScreenCentered } from '../ScreenCentered';
import { H2, P } from '../Typography';
import * as css from './Detail.module.scss';

export const Detail = () => {
	const { assetId, assetType } = useAssertedParams({
		assetId: validateId,
		assetType: validateAssetType,
	});

	const dataProvider = useDataProvider();

	const { asset, loading, error } = useDetailAsset(assetType, assetId);

	const [scrollPx, setScrollPx] = useState(0);
	const scrollFunctions = useRef<Record<number, () => void>>({});
	const scroll = useCallback((px: number) => {
		if (!scrollFunctions.current[px]) {
			scrollFunctions.current[px] = () => setScrollPx(px);
		}
		return scrollFunctions.current[px];
	}, []);

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
					<div
						className={css['backdrop-image']}
						style={{
							backgroundImage: `url(${dataProvider.getImageUrl(
								asset,
								['backdrop', 'still', 'poster', 'profile'],
								{
									width: 1920,
								},
							)})`,
						}}
					/>
					<div className={css['inner-wrap']}>
						<div
							className={css.scroller}
							key={assetId}
							style={{ transform: `translateY(-${scrollPx}px)` }}
						>
							{isMovie(asset) && (
								<DetailMovie
									asset={asset as MovieAsset}
									scroll={scroll}
								/>
							)}
							{isSeries(asset) && (
								<DetailSeries
									asset={asset as SeriesAsset}
									scroll={scroll}
								/>
							)}
							{isPerson(asset) && (
								<DetailPerson
									asset={asset as PersonAsset}
									scroll={scroll}
								/>
							)}
						</div>
					</div>
				</VerticalFocus>
			)}
		</Screen>
	);
};
