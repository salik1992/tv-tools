import { type ComponentProps, type FocusEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import type {
	Asset,
	AssetDescription,
	MovieAsset,
	ShowAllAsset,
} from '@salik1992/test-app-data/types';
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
		switch (asset?.type) {
			case 'show-all':
				navigate(
					`/discover/${btoa((asset as unknown as ShowAllAsset).data)}`,
				);
				break;
			default:
				navigate(`detail/${asset?.type}/${asset?.id}`);
		}
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
			{asset && (asset as MovieAsset).images ? (
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
			) : (
				<div className={css.colorbox}>
					<P>{asset?.title.toLowerCase() ?? '-'}</P>
				</div>
			)}
			<H1 className={css.text}>{asset?.title ?? NBSP}</H1>
			<P className={css.text}>{asset?.description ?? NBSP}</P>
		</Interactable>
	);
};
Hero.width = WIDTH + MARGIN;
Hero.height = HEIGHT;
