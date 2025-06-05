import type { HTMLProps } from 'react';
import * as css from './DetailLabel.module.scss';

export const DetailLabel = ({
	className,
	...props
}: HTMLProps<HTMLSpanElement>) => (
	<span className={`${css.label} ${className}`} {...props} />
);
