import type { ComponentProps, HTMLProps } from 'react';
import {
	backspace,
	done,
	layout,
	shiftAndCaps,
} from '@salik1992/tv-tools/virtual-keyboard';
import { Interactable } from '@salik1992/tv-tools-react/focus';
import { VirtualKeyboard } from '@salik1992/tv-tools-react/virtual-keyboard';
import * as css from './VirtualKeyboard.module.scss';

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

const Keyboard = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
	<div className={`${css.keyboard} ${className}`} {...props} />
);

const Row = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
	<div className={`${css.row} ${className}`} {...props} />
);

const Key = ({ className, ...props }: ComponentProps<typeof Interactable>) => (
	<Interactable className={`${css.key} ${className}`} {...props} />
);

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
