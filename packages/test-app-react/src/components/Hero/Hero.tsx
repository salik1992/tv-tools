import { type ComponentProps, type FocusEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import type { Asset, AssetDescription } from '@salik1992/test-app-data/types';
import { useDataProvider } from '../../data';
import { Image } from '../Image';
import { COLUMN, H1, NBSP, P, ROW } from '../Typography';
import * as css from './Hero.module.scss';

const WIDTH = 66 * COLUMN;
const HEIGHT = 19 * ROW;
const MARGIN = 5 * COLUMN;

export const Hero = ({
	asset,
	id,
	style,
	onFocus,
}: {
	asset?: Asset & AssetDescription;
	id?: string;
	style?: ComponentProps<'div'>['style'];
	onFocus?: (event: FocusEvent) => void;
}) => {
	const dataProvider = useDataProvider();
	const navigate = useNavigate();

	const onPress = useCallback(() => {
		navigate(`detail/${asset?.type}/${asset?.id}`);
		return true;
	}, [navigate, asset]);

	return (
		<Interactable
			id={id}
			className={css.wrap}
			style={{ ...style, visibility: asset ? 'visible' : 'hidden' }}
			onPress={onPress}
			onFocus={onFocus}
		>
			<Image
				className={css.image}
				src={
					asset
						? dataProvider.getImageUrl(
								asset,
								['backdrop', 'still'],
								{ width: WIDTH },
							)
						: ''
				}
			/>
			<H1 className={css.text}>{asset?.title ?? NBSP}</H1>
			<P className={css.text}>{asset?.description ?? NBSP}</P>
		</Interactable>
	);
};
Hero.width = WIDTH + MARGIN;
Hero.height = HEIGHT;
