import { Interactable } from './Interactable';
import { RenderProgress } from './RenderProgress';
import { TableFocusContainer } from './TableFocusContainer';
import { focus } from './focus';

type Item = string | { id: string; colSpan?: number; rowSpan?: number };

const el = (id: string) => new Interactable(id);

const processTable = (table: Item[][], container: TableFocusContainer) => {
	const interactables: Interactable[][] = [];
	container.setRenderProgress(RenderProgress.STARTED);
	table.forEach((row, i) => {
		container.addRow();
		interactables.push([]);
		row.forEach((item) => {
			const id = typeof item === 'string' ? item : item.id;
			const spans =
				typeof item === 'string'
					? undefined
					: { colSpan: item.colSpan, rowSpan: item.rowSpan };
			const interactable = el(id);
			interactables[i].push(interactable);
			container.addChild(id, spans);
		});
	});
	container.setRenderProgress(RenderProgress.FINISHED);
	return interactables;
};

const clean = (interactables: Interactable[][]) => {
	interactables.forEach((row) => {
		row.forEach((interactable) => {
			interactable.destroy();
		});
	});
};

describe('TableFocusContainer', () => {
	const container = new TableFocusContainer('test');

	it('should navigate among the elements', () => {
		const interactables = processTable(
			[
				['a', 'b', 'c'],
				['d', 'e', 'f'],
				['g', 'h', 'i'],
			],
			container,
		);
		const spy = jest.spyOn(focus, 'focus');
		expect(container.moveFocus({ x: 1 }, 'a')).toBe(true);
		expect(spy).toHaveBeenCalledWith('b', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'b')).toBe(true);
		expect(spy).toHaveBeenCalledWith('e', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'e')).toBe(true);
		expect(spy).toHaveBeenCalledWith('h', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'h')).toBe(false);
		expect(container.moveFocus({ x: 1 }, 'h')).toBe(true);
		expect(spy).toHaveBeenCalledWith('i', { preventScroll: true });
		expect(container.moveFocus({ x: 1 }, 'i')).toBe(false);
		expect(container.moveFocus({ y: -1 }, 'i')).toBe(true);
		expect(spy).toHaveBeenCalledWith('f', { preventScroll: true });
		expect(container.moveFocus({ y: -1 }, 'f')).toBe(true);
		expect(spy).toHaveBeenCalledWith('c', { preventScroll: true });
		expect(container.moveFocus({ y: -1 }, 'c')).toBe(false);
		expect(container.moveFocus({ x: -1 }, 'c')).toBe(true);
		expect(spy).toHaveBeenCalledWith('b', { preventScroll: true });
		expect(container.moveFocus({ x: -1 }, 'b')).toBe(true);
		expect(spy).toHaveBeenCalledWith('a', { preventScroll: true });
		expect(container.moveFocus({ x: -1 }, 'a')).toBe(false);
		expect(container.moveFocus({ y: 1 }, 'a')).toBe(true);
		expect(spy).toHaveBeenCalledWith('d', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'd')).toBe(true);
		expect(spy).toHaveBeenCalledWith('g', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'g')).toBe(false);
		spy.mockRestore();
		clean(interactables);
	});

	it('should navigate among the elements with rowSpan and colSpan', () => {
		const interactables = processTable(
			[
				[
					'a',
					{ id: 'b', colSpan: 2 },
					{ id: 'c', rowSpan: 3, colSpan: 3 },
				],
				['d', 'e', { id: 'f', rowSpan: 2 }],
				['g', 'h'],
				['i', 'j', 'k', 'l', 'm', 'n'],
			],
			container,
		);
		expect(container['focusTable']).toEqual([
			['a', 'b', 'b', 'c', 'c', 'c'],
			['d', 'e', 'f', 'c', 'c', 'c'],
			['g', 'h', 'f', 'c', 'c', 'c'],
			['i', 'j', 'k', 'l', 'm', 'n'],
		]);
		const spy = jest.spyOn(focus, 'focus');
		expect(container.moveFocus({ x: 1 }, 'a')).toBe(true);
		expect(spy).toHaveBeenCalledWith('b', { preventScroll: true });
		expect(container.moveFocus({ x: 1 }, 'b')).toBe(true);
		expect(spy).toHaveBeenCalledWith('c', { preventScroll: true });
		expect(container.moveFocus({ y: 1 }, 'c')).toBe(true);
		expect(spy).toHaveBeenCalledWith('l', { preventScroll: true });
		expect(container.moveFocus({ x: 1 }, 'l')).toBe(true);
		expect(spy).toHaveBeenCalledWith('m', { preventScroll: true });
		expect(container.moveFocus({ x: 1 }, 'm')).toBe(true);
		expect(spy).toHaveBeenCalledWith('n', { preventScroll: true });
		expect(container.moveFocus({ y: -1 }, 'n')).toBe(true);
		expect(spy).toHaveBeenCalledWith('c', { preventScroll: true });
		expect(container.moveFocus({ x: -1 }, 'c')).toBe(true);
		expect(spy).toHaveBeenCalledWith('f', { preventScroll: true });
		expect(container.moveFocus({ y: -1 }, 'f')).toBe(true);
		expect(spy).toHaveBeenCalledWith('b', { preventScroll: true });
		expect(container.moveFocus({ x: -1 }, 'b')).toBe(true);
		expect(spy).toHaveBeenCalledWith('a', { preventScroll: true });
		// Pointer moved to C
		expect(container.moveFocus({ y: 1 }, 'c')).toBe(true);
		expect(spy).toHaveBeenCalledWith('l', { preventScroll: true });
		// Pointer moved to G
		expect(container.moveFocus({ y: -1 }, 'g')).toBe(true);
		expect(spy).toHaveBeenCalledWith('d', { preventScroll: true });
		spy.mockRestore();
		clean(interactables);
	});

	it('should remember focus positions', () => {
		const interactables1 = processTable(
			[
				['a', 'b', 'c'],
				['d', 'e', 'f'],
				['g', 'h', 'i'],
			],
			container,
		);
		// @ts-expect-error: mock event
		focus.handleFocusEvent({ target: { id: 'e' } });
		const spy = jest.spyOn(focus, 'focus');
		container.focus({ preventScroll: true });
		expect(spy).toHaveBeenCalledWith('e', { preventScroll: true });
		clean(interactables1);
		const interactables2 = processTable(
			[
				['1', '2', '3'],
				['4', '5', '6'],
				['7', '8', '9'],
			],
			container,
		);
		container.focus({ preventScroll: true });
		expect(spy).toHaveBeenCalledWith('4', { preventScroll: true });
		clean(interactables2);
		const interactables3 = processTable([['*']], container);
		container.focus({ preventScroll: true });
		expect(spy).toHaveBeenCalledWith('*', { preventScroll: true });
		clean(interactables3);
		spy.mockRestore();
	});

	it('should focus itself on focus without children and then the first child', () => {
		const spy = jest.spyOn(focus, 'focus');
		processTable([[]], container);
		container.focus({ preventScroll: true });
		expect(spy).not.toHaveBeenCalled();
		const interactables = processTable([['a']], container);
		expect(spy).toHaveBeenCalledWith('a', { preventScroll: true });
		clean(interactables);
		spy.mockRestore();
	});

	it('should remove itself from focus on destroy', () => {
		expect(focus.hasFocusId('test')).toBe(true);
		container.destroy();
		expect(focus.hasFocusId('test')).toBe(false);
	});
});
