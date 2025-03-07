import { css } from 'styled-components';
import leftArrow from '../assets/left-arrow.png';
import rightArrow from '../assets/right-arrow.png';

export const MouseArrows = css`
	.mouse-arrow {
		position: absolute;
		top: 0;
		opacity: 0;
		background-color: rgba(0, 0, 0, 0);
		background-position: center center;
		background-repeat: no-repeat;
		cursor: pointer;
		transition:
			opacity 300ms,
			background-color 300ms;

		&:hover {
			background-color: rgba(0, 0, 0, 0.3);
		}

		&.next {
			background-image: url(${rightArrow});
		}

		&.previous {
			background-image: url(${leftArrow});
		}
	}
`;
