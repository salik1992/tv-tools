import styled, { keyframes } from 'styled-components';
import { Input as InputBase } from '@salik1992/tv-tools-react/input';
import { Border, Colors } from './Theme';
import { Typography } from './Typography';

const breathe = keyframes`
	0% { opacity: 1; }
	50% { opacity: 0; }
	100% { opacity: 1; }
`;

export const Input = styled(InputBase)`
	position: relative;
	${Border}
	border-color: ${Colors.fg.primary};
	font-size: ${Typography.row}px;
	padding: ${Typography.column}px;

	&.active {
		border-color: ${Colors.fg.focus};
	}

	input {
		position: absolute;
		opacity: 0;
	}

	.text {
		position: relative;
		white-space: pre;
	}
	&.placeholder {
		.text {
			color: ${Colors.fg.secondary};
		}
	}

	.caret,
	.selection {
		position: absolute;
		top: ${0.5 * Typography.row}px;
		left: ${0.5 * Typography.row}px;
	}

	.caret {
		display: none;
		animation-name: ${breathe};
		animation-duration: 1s;
		animation-iteration-count: infinite;
		&::after {
			position: absolute;
			left: -${0.5 * Typography.column}px;
			content: '|';
			width: 0;
		}
	}

	.selection {
		display: block;
		background-color: ${Colors.bg.focus};
		height: ${1.3 * Typography.row}px;
		z-index: -1;
	}

	&.active {
		.caret,
		.selection {
			display: block;
		}
	}
`;
