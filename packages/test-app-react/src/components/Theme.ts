import { css } from 'styled-components';
import { Performance as PerformanceEnum } from '@salik1992/tv-tools/utils/Performance';

export const Performance = PerformanceEnum.ANIMATED;

export const Timing = {
	base: 300,
} as const;

export const Colors = {
	fg: {
		primary: '#ffffff',
		secondary: '#cccccc',
		focus: '#ff6666',
		disabled: '#66666f',
		warning: '#cccc00',
	},
	bg: {
		primary: '#09090f',
		action: '#33333f',
		focus: '#66666f',
		disabled: '#99999f',
		opaque: 'rgba(0, 0, 0, 0.75)',
		danger: '#ff0000',
	},
} as const;

export const Transition = (...properties: (string | [string, number])[]) =>
	Performance === PerformanceEnum.ANIMATED
		? css`
				transition: ${properties
					.map((property) =>
						typeof property === 'string'
							? `${property} ${Timing.base}ms`
							: `${property[0]} ${property[1]}ms`,
					)
					.join(', ')};
			`
		: '';

export const Border = css`
	box-sizing: border-box;
	border-width: 3px;
	border-style: dashed;
	border-color: transparent;
	outline: none;

	${Transition('border-color')}

	&:focus {
		border-color: ${Colors.fg.focus};
	}
`;
