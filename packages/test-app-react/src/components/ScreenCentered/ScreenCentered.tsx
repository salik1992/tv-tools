import * as css from './ScreenCentered.module.scss';

export const ScreenCentered = ({
	className = '',
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={`${css.container} ${className}`} {...props} />
);
