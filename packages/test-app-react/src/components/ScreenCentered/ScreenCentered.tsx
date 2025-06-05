import type { HTMLProps } from 'react';
import * as css from './ScreenCentered.module.scss';

export const ScreenCentered = ({
	className = '',
	...props
}: HTMLProps<HTMLDivElement>) => (
	<div className={`${css.container} ${className}`} {...props} />
);
