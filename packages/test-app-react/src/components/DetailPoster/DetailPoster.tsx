import * as css from './DetailPoster.module.scss';

export const DetailPoster = ({
	className,
	$src,
	...props
}: { $src: string | null } & React.HTMLProps<HTMLDivElement>) => (
	<div
		className={`${css.poster} ${className}`}
		style={{ backgroundImage: `url(${$src})` }}
		{...props}
	/>
);
