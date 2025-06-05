import type { Asset, AssetDescription } from '@salik1992/test-app-data/types';
import { H4, P } from '../Typography';
import * as css from './AssetsRowDetail.module.scss';

export const AssetsRowDetail = ({
	visible,
	asset,
}: {
	visible: boolean;
	asset: Asset & AssetDescription;
}) => (
	<div className={`${css.wrap} ${visible ? css.visible : ''}`}>
		<H4 className={css.title}>{asset.title}</H4>
		<P className={css.description}>
			{asset.description || 'No description provided.'}
		</P>
	</div>
);
