import { layout } from './constants';
import { validateLayouts } from './validateLayouts';

describe('validateLayouts', () => {
	it('should throw an error if layouts is not provided', () => {
		expect(() => validateLayouts(undefined)).toThrow(
			'Layouts are required',
		);
	});

	it('should throw an error if layouts is not an object', () => {
		expect(() => validateLayouts('not an object')).toThrow(
			'Layouts should be an object',
		);
	});

	it('should throw an error if layouts is empty', () => {
		expect(() => validateLayouts({})).toThrow(
			'Layouts should not be empty',
		);
	});

	it('should throw an error if layout is not an object', () => {
		expect(() =>
			validateLayouts({
				layout1: 'not an object',
			}),
		).toThrow('Layout layout1 should be an object, got not an object');
	});

	it('should throw an error if layout keys is not an array', () => {
		expect(() =>
			validateLayouts({
				layout1: { keys: 'not an array' },
			}),
		).toThrow(
			'Property "keys" of layout layout1 should be an array, got not an array',
		);
	});

	it('should throw an error if layout keys is not an array of arrays', () => {
		expect(() =>
			validateLayouts({
				layout1: { keys: [1, 2, 3] },
			}),
		).toThrow('Layout layout1 should be an array of arrays, got 1');
	});

	it('should throw an error if layout key is not a string or object', () => {
		expect(() =>
			validateLayouts({
				layout1: {
					keys: [
						[1, 2],
						[3, 4],
					],
				},
			}),
		).toThrow(
			'Layout layout1 should be an array of strings or objects, got 1',
		);
	});

	it('should throw an error if layout key is an object without a key property', () => {
		expect(() =>
			validateLayouts({
				layout1: { keys: [[{ colSpan: 1 }]] },
			}),
		).toThrow(
			'The property "key" of Key in layout layout1 should be a string, got undefined',
		);
	});

	it('should throw an error if layout key is an object with invalid properties', () => {
		expect(() =>
			validateLayouts({
				layout1: { keys: [[{ key: 'key', colSpan: 'not a number' }]] },
			}),
		).toThrow(
			'The property "colSpan" of Key in layout layout1 should be a number, got not a number',
		);
	});

	it('should throw an error if layout key is an object with invalid action property', () => {
		expect(() =>
			validateLayouts({
				layout1: {
					keys: [[{ key: 'key', action: 'not a function' }]],
				},
			}),
		).toThrow(
			'The property "action" of Key in layout layout1 should be a function, got not a function',
		);
	});

	it('should throw when an unallowed action is passed', () => {
		expect(() =>
			validateLayouts({
				layout1: {
					keys: [
						[{ key: 'key', action: () => ({ action: 'unknown' }) }],
					],
				},
			}),
		).toThrow('The action "unknown" is not allowed in layout layout1');
	});

	it('should throw when a layout switch points to unknown layout', () => {
		expect(() =>
			validateLayouts({
				layout1: {
					keys: [[{ key: 'key', action: layout('unknown') }]],
				},
			}),
		).toThrow('The layout "unknown" is not defined');
	});

	it('should validate a valid layout', () => {
		expect(() =>
			validateLayouts({
				layout1: {
					keys: [
						[{ key: 'key1' }],
						[{ key: 'key2', colSpan: 2 }],
						[
							{
								key: 'key3',
								rowSpan: 2,
								action: layout('layout2'),
							},
						],
					],
				},
				layout2: {
					keys: [
						[{ key: 'key4' }],
						[{ key: 'key5', colSpan: 2 }],
						[
							{
								key: 'key6',
								rowSpan: 2,
								action: layout('layout1'),
							},
						],
					],
				},
			}),
		).not.toThrow();
	});
});
