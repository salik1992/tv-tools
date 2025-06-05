import type { HTMLProps } from 'react';
import * as css from './DetailPoster.module.scss';

export const DetailPoster = ({
	className,
	$src,
	...props
}: { $src: string | null } & HTMLProps<HTMLDivElement>) => (
	<div
		className={`${css.poster} ${className}`}
		style={{ backgroundImage: `url(${$src})` }}
		{...props}
	/>
);
