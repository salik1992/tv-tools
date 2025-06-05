import * as css from './DetailLabel.module.scss';

export const DetailLabel = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
	<span className={`${css.label} ${className}`} {...props} />
);
