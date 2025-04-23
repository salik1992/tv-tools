import { ComponentProps } from 'react';
import styled from 'styled-components';
import {
	backspace,
	done,
	layout,
	shiftAndCaps,
} from '@salik1992/tv-tools/virtual-keyboard';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { VirtualKeyboard } from '@salik1992/tv-tools-react/virtual-keyboard';
import { Colors, Transition } from './Theme';
import { Typography } from './Typography';

const Keyboard = styled.div`
	display: inline-block;
	position: relative;
	transform: translateX(50%);

	&.effect-shift,
	&.effect-caps {
		text-transform: uppercase;
	}

	&.effect-caps {
		.vk-shift {
			text-decoration: underline;
		}
	}

	&.layout-base {
		.vk-done {
			margin-left: ${1.5 * Typography.row}px;
		}
	}
`;

const Row = styled.div`
	height: ${2 * Typography.row}px;
	margin-bottom: ${Typography.column}px;
`;

const Key = styled(Interactable)`
	display: inline-block;
	width: ${2 * Typography.row}px;
	height: ${2 * Typography.row}px;
	line-height: ${1.5 * Typography.row}px;
	font-size: ${Typography.row}px;
	text-align: center;
	vertical-align: top;
	outline: none;
	border-width: 3px;
	border-style: solid;
	border-color: ${Colors.fg.secondary};
	box-sizing: border-box;
	${Transition('color', 'background-color', 'border-color')}
	margin-right: ${1 * Typography.column}px;
	user-select: none;
	cursor: pointer;

	&.vk-backspace,
	&.vk-shift {
		font-size: 4em;
	}

	&.vk-done,
	&.vk-shift,
	&.vk-space {
		text-transform: initial !important;
	}

	&.vk-done,
	&.vk-backspace,
	&.vk-switch,
	&.vk-shift {
		width: ${4 * Typography.row}px;
		height: ${4.5 * Typography.row}px;
		line-height: ${4 * Typography.row}px;
	}
	&.vk-space {
		width: ${15 * Typography.row}px;
		margin-left: ${9 * Typography.row}px;
	}

	&.vk-q,
	&.vk-z,
	&.vk-1 {
		margin-left: ${1 * Typography.row}px;
	}

	&.vk-a,
	&.vk-exclamation,
	&.vk-underscore {
		margin-left: ${6 * Typography.row}px;
	}

	&.vk-z {
		margin-left: ${2 * Typography.row}px;
	}

	&.vk-done {
		margin-left: ${2 * Typography.row}px;
	}

	&:focus {
		color: ${Colors.bg.primary};
		background-color: ${Colors.fg.primary};
		border-color: ${Colors.fg.primary};
	}
`;

const QWERTYUIOP = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const ASDFGHJK = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];
const ZXCVBNM = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const SYMBOLS_1 = [
	{ key: 'exclamation', label: '!', char: '!' },
	{ key: 'at', label: '@', char: '@' },
	{ key: 'hash', label: '#', char: '#' },
	{ key: 'dollar', label: '$', char: '$' },
	{ key: 'percent', label: '%', char: '%' },
	{ key: 'caret', label: '^', char: '^' },
	{ key: 'ampersand', label: '&', char: '&' },
	{ key: 'asterisk', label: '*', char: '*' },
	{ key: 'left-parenthesis', label: '(', char: '(' },
	{ key: 'right-parenthesis', label: ')', char: ')', colSpan: 2 },
];
const SYMBOLS_2 = [
	{ key: 'underscore', label: '_', char: '_' },
	{ key: 'equal', label: '=', char: '=' },
	{ key: 'plus', label: '+', char: '+' },
	{ key: 'left-brace', label: '{', char: '{' },
	{ key: 'right-brace', label: '}', char: '}' },
	{ key: 'left-bracket', label: '[', char: '[' },
	{ key: 'right-bracket', label: ']', char: ']' },
	{ key: 'colon', label: ':', char: ':' },
	{ key: 'semicolon', label: ';', char: ';' },
	{ key: 'double-quote', label: '"', char: '"', colSpan: 2 },
];
const BACKSPACE = {
	key: 'backspace',
	label: '⌫',
	rowSpan: 2,
	action: backspace,
};
const DONE = {
	key: 'done',
	label: 'Done',
	rowSpan: 2,
	action: done,
};
const SPACE = {
	key: 'space',
	char: ' ',
	label: 'Space',
	colSpan: 10,
};

const LAYOUTS = {
	base: {
		initialKey: 'g',
		keys: [
			[
				{
					key: 'switch',
					label: '123',
					action: layout('symbols'),
					rowSpan: 2,
				},
				...QWERTYUIOP,
				BACKSPACE,
			],
			[...ASDFGHJK, { key: 'l', colSpan: 2 }],
			[
				{
					key: 'shift',
					label: '⇪',
					rowSpan: 2,
					action: shiftAndCaps,
				},
				...ZXCVBNM,
				{ key: 'comma', label: ',', char: ',' },
				{ key: 'dot', label: '.', char: '.', colSpan: 2 },
				DONE,
			],
			[SPACE],
		],
	},
	symbols: {
		initialKey: 'caret',
		keys: [
			[
				{
					key: 'switch',
					label: 'QWERTY',
					action: layout('base'),
					rowSpan: 4,
				},
				...NUMBERS,
				{ key: 'minus', label: '-', char: '-' },
				BACKSPACE,
			],
			SYMBOLS_1,
			[...SYMBOLS_2, DONE],
			[{ ...SPACE, colSpan: SPACE.colSpan + 1 }],
		],
	},
};

export const GenericKeyboard = (
	props: Omit<
		ComponentProps<typeof VirtualKeyboard>,
		'Keyboard' | 'Row' | 'Key' | 'blockNavigation' | 'layouts'
	>,
) => {
	return (
		<VirtualKeyboard
			{...props}
			Keyboard={Keyboard}
			Row={Row}
			Key={Key}
			blockNavigation
			layouts={LAYOUTS}
		/>
	);
};
