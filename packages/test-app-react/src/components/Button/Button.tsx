import { Interactable } from '@salik1992/tv-tools-react/focus';
import * as css from './Button.module.scss';

export const Button = ({
	type = 'primary',
	className = '',
	...props
}: Parameters<typeof Interactable>[0] & {
	type?: 'primary' | 'secondary' | 'danger';
}) => (
	<Interactable
		className={`${css.button} ${css[type]} ${className}`}
		{...props}
	/>
);
