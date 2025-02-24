import { toKeys } from '../utils/toKeys';
import { Keys } from './Keys';
import { isDirectional, isVertical, isHorizontal } from './utils';

const VERTICAL_KEYS = ['UP', 'DOWN'];
const HORIZONTAL_KEYS = ['LEFT', 'RIGHT'];
const DIRECTIONAL_KEYS = [...VERTICAL_KEYS, ...HORIZONTAL_KEYS];

describe('Control Utils', () => {
	describe('isDirectional', () => {
		it.each(toKeys(Keys))(
			'should return whether %s isDirectional',
			(key) => {
				expect(
					isDirectional(Keys[key].toKeyboardEvent('keydown')),
				).toBe(DIRECTIONAL_KEYS.includes(key));
			},
		);
	});

	describe('isHorizontal', () => {
		it.each(toKeys(Keys))(
			'should return whether %s isHorizontal',
			(key) => {
				expect(isHorizontal(Keys[key].toKeyboardEvent('keydown'))).toBe(
					HORIZONTAL_KEYS.includes(key),
				);
			},
		);
	});

	describe('isVertical', () => {
		it.each(toKeys(Keys))('should return whether %s isVertical', (key) => {
			expect(isVertical(Keys[key].toKeyboardEvent('keydown'))).toBe(
				VERTICAL_KEYS.includes(key),
			);
		});
	});
});
