import { FocusContainer } from '../focus';
import { Performance } from '../utils/Performance';
import { ListBase } from './ListBase';

jest.useFakeTimers(); // Because events run async

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
class List extends ListBase<{}> {
	move = jest.fn(() => this.renderData);
}

describe('ListBase', () => {
	const container = new FocusContainer();
	const list = new List(container, {
		id: 'list',
		performance: Performance.BASIC,
		dataLength: 5,
		visibleElements: 5,
		config: {},
	});

	const focusSpy = jest
		.spyOn(container, 'focusChild')
		.mockImplementation(() => {});

	const listData = {
		elements: [
			{
				dataIndex: 0,
				id: 'list-0',
				offset: 0,
				onFocus: expect.any(Function),
			},
			{
				dataIndex: 1,
				id: 'list-1',
				offset: 0,
				onFocus: expect.any(Function),
			},
			{
				dataIndex: 2,
				id: 'list-2',
				offset: 0,
				onFocus: expect.any(Function),
			},
			{
				dataIndex: 3,
				id: 'list-3',
				offset: 0,
				onFocus: expect.any(Function),
			},
			{
				dataIndex: 4,
				id: 'list-4',
				offset: 0,
				onFocus: expect.any(Function),
			},
		],
		listOffset: 0,
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

	it('should move backwards while it can', () => {
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
