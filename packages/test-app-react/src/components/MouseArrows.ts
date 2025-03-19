import { css } from 'styled-components';
import { Colors, Transition } from './Theme';

export const MouseArrows = css`
	.mouse-arrow {
		position: absolute;
		top: 0;
		opacity: 0;
		background-color: rgba(0, 0, 0, 0);
		background-position: center center;
		background-repeat: no-repeat;
		cursor: pointer;
		${Transition('opacity', 'background-color')}

		&:hover {
			background-color: ${Colors.bg.opaque};

			&::after {
				color: ${Colors.fg.focus};
			}
		}

		&::after {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 100px;
			color: ${Colors.fg.primary};
			${Transition('color')}
		}

		&.next {
			&::after {
				content: '\\2192';
			}
		}

		&.previous {
			&::after {
				content: '\\2190';
			}
		}
	}
`;
