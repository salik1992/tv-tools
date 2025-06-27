import { FocusContainer, FocusManager } from '../focus';
import { Performance } from '../utils/Performance';
import { ListBase } from './ListBase';

jest.useFakeTimers(); // Because events run async

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
class List extends ListBase<string, {}> {
	protected move = jest.fn(() => this.renderData);
}

const element = (id: string, dataIndex: number, offset: number) => ({
	dataIndex,
	id,
	item: dataIndex.toString(),
	offset,
	onFocus: expect.any(Function),
});

describe('ListBase', () => {
	const focus = new FocusManager();
	const container = new FocusContainer(focus);
	const list = new List(
		container,
		{
			id: 'list',
			performance: Performance.BASIC,
			visibleElements: 5,
			config: {},
		},
		Array.from({ length: 5 }, (_, i) => i.toString()),
	);

	const focusSpy = jest
		.spyOn(container, 'focusChild')
		.mockImplementation(() => {});

	const listData = {
		elements: [
			element('list-0', 0, 0),
			element('list-1', 1, 0),
			element('list-2', 2, 0),
			element('list-3', 3, 0),
			element('list-4', 4, 0),
		],
		baseOffset: 0,
		nextArrow: true,
		previousArrow: false,
	};

	beforeEach(() => {
		focusSpy.mockClear();
	});

	it('should provide initial render data', () => {
		expect(list.getRenderData()).toEqual(listData);
	});

	it('should keep moving forward while it can', () => {
		expect(list.moveBy(1)).toBe(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'list-1', {
			preventScroll: true,
		});
		list.moveBy(1);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'list-2', {
			preventScroll: true,
		});
		list.moveBy(1);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'list-3', {
			preventScroll: true,
		});
		list.moveBy(1);
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'list-4', {
			preventScroll: true,
		});
		expect(list.moveBy(1)).toBe(false);
		expect(focusSpy).not.toHaveBeenCalledTimes(5);
	});

	it('should keep moving backwards while it can', () => {
		expect(list.moveBy(-1)).toBe(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'list-3', {
			preventScroll: true,
		});
		list.moveBy(-1);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'list-2', {
			preventScroll: true,
		});
		list.moveBy(-1);
		expect(focusSpy).toHaveBeenNthCalledWith(3, 'list-1', {
			preventScroll: true,
		});
		list.moveBy(-1);
		expect(focusSpy).toHaveBeenNthCalledWith(4, 'list-0', {
			preventScroll: true,
		});
		expect(list.moveBy(-1)).toBe(false);
		expect(focusSpy).not.toHaveBeenCalledTimes(5);
	});

	it('should move to direct index', () => {
		expect(list.moveTo(3)).toBe(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'list-3', {
			preventScroll: true,
		});
	});

	it('should clamp the index', () => {
		expect(list.moveTo(-1)).toBe(true);
		expect(focusSpy).toHaveBeenNthCalledWith(1, 'list-0', {
			preventScroll: true,
		});
		expect(list.moveTo(5)).toBe(true);
		expect(focusSpy).toHaveBeenNthCalledWith(2, 'list-4', {
			preventScroll: true,
		});
	});

	it('should trigger dataindex event', () => {
		const spy = jest.fn();
		list.addEventListener('dataIndex', spy);
		list.moveTo(3);
		jest.runAllTimers();
		expect(spy).toHaveBeenCalledWith(3);
		list.moveBy(-1);
		jest.runAllTimers();
		expect(spy).toHaveBeenCalledWith(2);
		list.removeEventListener('dataIndex', spy);
	});

	it('should trigger renderData event', () => {
		const spy = jest.fn();
		list.addEventListener('renderData', spy);
		list.moveTo(3);
		jest.runAllTimers();
		expect(spy).toHaveBeenCalledWith(listData);
		list.moveBy(-1);
		jest.runAllTimers();
		expect(spy).toHaveBeenCalledWith(listData);
		list.removeEventListener('renderData', spy);
	});
});
