import { FocusContainer, FocusManager } from '../focus';
import { Performance } from '../utils/Performance';
import { GridBase } from './GridBase';

jest.useFakeTimers(); // Because events run async

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
class Grid extends GridBase<string, {}> {
	protected move = jest.fn(() => this.renderData);
}

const element = (id: string, dataIndex: number, offset: number) => ({
	dataIndex,
	id,
	item: dataIndex.toString(),
	offset,
	onFocus: expect.any(Function),
});

const group = (
	id: string,
	offset: number,
	elements: ReturnType<typeof element>[],
) => ({
	id,
	offset,
	elements,
});

describe('GridBase', () => {
	const focus = new FocusManager();
	const container = new FocusContainer(focus);
	const grid = new Grid(
		container,
		{
			id: 'grid',
			performance: Performance.BASIC,
			elementsPerGroup: 5,
			visibleGroups: 5,
			config: {},
		},
		Array.from({ length: 25 }, (_, i) => i.toString()),
	);

	const focusSpy = jest
		.spyOn(container, 'focusChild')
		.mockImplementation(() => {});

	const gridData = {
		groups: [
			group('grid-g0', 0, [
				element('grid-g0-e0', 0, 0),
				element('grid-g0-e1', 1, 0),
				element('grid-g0-e2', 2, 0),
				element('grid-g0-e3', 3, 0),
				element('grid-g0-e4', 4, 0),
			]),
			group('grid-g1', 0, [
				element('grid-g1-e0', 5, 0),
				element('grid-g1-e1', 6, 0),
				element('grid-g1-e2', 7, 0),
				element('grid-g1-e3', 8, 0),
				element('grid-g1-e4', 9, 0),
			]),
			group('grid-g2', 0, [
				element('grid-g2-e0', 10, 0),
				element('grid-g2-e1', 11, 0),
				element('grid-g2-e2', 12, 0),
				element('grid-g2-e3', 13, 0),
				element('grid-g2-e4', 14, 0),
			]),
			group('grid-g3', 0, [
				element('grid-g3-e0', 15, 0),
				element('grid-g3-e1', 16, 0),
				element('grid-g3-e2', 17, 0),
				element('grid-g3-e3', 18, 0),
				element('grid-g3-e4', 19, 0),
			]),
			group('grid-g4', 0, [
				element('grid-g4-e0', 20, 0),
				element('grid-g4-e1', 21, 0),
				element('grid-g4-e2', 22, 0),
				element('grid-g4-e3', 23, 0),
				element('grid-g4-e4', 24, 0),
			]),
		],
		baseOffset: 0,
		nextArrow: true,
		previousArrow: false,
	};

	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should provide initial render data', () => {
		expect(grid.getRenderData()).toEqual(gridData);
	});

	it('should keep moving forward while it can', () => {
		expect(grid.moveBy(1)).toEqual(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'grid-g0-e1', {
			preventScroll: true,
		});
		grid.moveBy(5);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'grid-g1-e1', {
			preventScroll: true,
		});
		grid.moveBy(5);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'grid-g2-e1', {
			preventScroll: true,
		});
		grid.moveBy(5);
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'grid-g3-e1', {
			preventScroll: true,
		});
		grid.moveBy(5);
		expect(focusSpy).toHaveBeenNthCalledWith(5, 'grid-g4-e1', {
			preventScroll: true,
		});
		grid.moveBy(5);
		expect(focusSpy).toHaveBeenNthCalledWith(6, 'grid-g4-e4', {
			preventScroll: true,
		});
		expect(grid.moveBy(5)).toEqual(false);
		expect(focusSpy).not.toHaveBeenCalledTimes(7);
	});

	it('should keep moving backwards while it can', () => {
		expect(grid.moveBy(-1)).toEqual(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'grid-g4-e3', {
			preventScroll: true,
		});
		grid.moveBy(-5);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'grid-g3-e3', {
			preventScroll: true,
		});
		grid.moveBy(-5);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'grid-g2-e3', {
			preventScroll: true,
		});
		grid.moveBy(-5);
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'grid-g1-e3', {
			preventScroll: true,
		});
		grid.moveBy(-5);
		expect(focusSpy).toHaveBeenNthCalledWith(5, 'grid-g0-e3', {
			preventScroll: true,
		});
		grid.moveBy(-5);
		expect(focusSpy).toHaveBeenNthCalledWith(6, 'grid-g0-e0', {
			preventScroll: true,
		});
		expect(grid.moveBy(-5)).toEqual(false);
		expect(focusSpy).not.toHaveBeenCalledTimes(7);
	});

	it('should move to direct index', () => {
		expect(grid.moveTo(3)).toEqual(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'grid-g0-e3', {
			preventScroll: true,
		});
		expect(grid.moveTo(16)).toEqual(true);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'grid-g3-e1', {
			preventScroll: true,
		});
		expect(grid.moveTo(22)).toEqual(true);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'grid-g4-e2', {
			preventScroll: true,
		});
	});

	it('should trigger dataIndex event', () => {
		const spy = jest.fn();
		grid.addEventListener('dataIndex', spy);
		grid.moveTo(3);
		jest.runAllTimers();
		expect(spy).toHaveBeenNthCalledWith(1, 3);
		grid.moveBy(5);
		jest.runAllTimers();
		expect(spy).toHaveBeenNthCalledWith(2, 8);
	});

	it('should trigger renderData event', () => {
		const spy = jest.fn();
		grid.addEventListener('renderData', spy);
		grid.moveTo(3);
		jest.runAllTimers();
		expect(spy).toHaveBeenNthCalledWith(1, gridData);
		grid.moveBy(5);
		jest.runAllTimers();
		expect(spy).toHaveBeenNthCalledWith(2, gridData);
	});
});
