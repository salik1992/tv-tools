import type { ComponentProps } from 'react';
import { InputWithVirtualKeyboard } from '@salik1992/tv-tools-react/input-with-virtual-keyboard';
import * as css from './Input.module.scss';

export const Input = ({
	className = '',
	...props
}: ComponentProps<typeof InputWithVirtualKeyboard>) => (
	<InputWithVirtualKeyboard
		className={`${css.input} ${className}`}
		{...props}
	/>
);
