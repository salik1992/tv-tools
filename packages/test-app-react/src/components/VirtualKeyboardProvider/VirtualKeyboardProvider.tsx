import type { ComponentProps } from 'react';
import { VirtualKeyboardProvider as VirtualKeyboardProviderBase } from '@salik1992/tv-tools-react/input-with-virtual-keyboard';
import * as css from './VirtualKeyboardProvider.module.scss';

export const VirtualKeyboardProvider = ({
	className = '',
	...props
}: ComponentProps<typeof VirtualKeyboardProviderBase>) => (
	<VirtualKeyboardProviderBase
		className={`${css['virtual-keyboard-provider']} ${className}`}
		{...props}
	/>
);
