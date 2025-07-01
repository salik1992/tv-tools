import { FocusContainer, FocusManager } from '../focus';
import { Performance } from '../utils/Performance';
import { BasicList } from './BasicList';
import { assertRenderData } from './mocks';

describe('BasicList', () => {
	const focus = new FocusManager();
	const container = new FocusContainer(focus);
	const focusSpy = jest
		.spyOn(container, 'focusChild')
		.mockImplementation(() => {});

	describe('Performance.BASIC', () => {
		const list = new BasicList(
			container,
			{
				id: 'list',
				performance: Performance.BASIC,
				visibleElements: 7,
				config: {
					navigatableElements: 5,
					scrolling: {
						first: 100,
						other: 200,
					},
				},
			},
			Array.from({ length: 15 }, (_, i) => i.toString()),
		);

		it('should render list at index 0', () => {
			assertRenderData(list.getRenderData(), focusSpy, {
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				ids: [
					'list-0',
					'list-1',
					'list-2',
					'list-3',
					'list-4',
					'list-5',
					'list-6',
				],
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});

		it('should move forward', () => {
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [1, 2, 3, 4, 5, 6, 7],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [2, 3, 4, 5, 6, 7, 8],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [3, 4, 5, 6, 7, 8, 9],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [4, 5, 6, 7, 8, 9, 10],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [5, 6, 7, 8, 9, 10, 11],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [6, 7, 8, 9, 10, 11, 12],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [8, 9, 10, 11, 12, 13, 14],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [9, 10, 11, 12, 13, 14, 15],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				baseOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});

		it('should move backward', () => {
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [9, 10, 11, 12, 13, 14, 15],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [8, 9, 10, 11, 12, 13, 14],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [6, 7, 8, 9, 10, 11, 12],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [5, 6, 7, 8, 9, 10, 11],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [4, 5, 6, 7, 8, 9, 10],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [3, 4, 5, 6, 7, 8, 9],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [2, 3, 4, 5, 6, 7, 8],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [1, 2, 3, 4, 5, 6, 7],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(false);
		});

		it('should manage jumps', () => {
			list.moveTo(3);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(14);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(11);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(0);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});
	});

	describe('Performance.ANIMATED', () => {
		const list = new BasicList(
			container,
			{
				id: 'list',
				performance: Performance.ANIMATED,
				visibleElements: 7,
				config: {
					navigatableElements: 5,
					scrolling: {
						first: 100,
						other: 200,
					},
				},
			},
			Array.from({ length: 15 }, (_, i) => i.toString()),
		);

		it('should render list at index 0', () => {
			assertRenderData(list.getRenderData(), focusSpy, {
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				ids: [
					'list-0',
					'list-1',
					'list-2',
					'list-3',
					'list-4',
					'list-5',
					'list-6',
				],
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});

		it('shoudl move forward', () => {
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				baseOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 1, 2, 3, 4, 5, 6],
				offsets: [1400, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				baseOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 2, 3, 4, 5, 6],
				offsets: [1400, 1400, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 3, 4, 5, 6],
				offsets: [1400, 1400, 1400, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 4, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 1100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 1300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 1500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				baseOffset: 1700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 8, 9, 10, 11, 12, 13],
				offsets: [2800, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				baseOffset: 1900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 9, 10, 11, 12, 13],
				offsets: [2800, 2800, 1400, 1400, 1400, 1400, 1400],
			});
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 2100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			expect(list.moveBy(1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				baseOffset: 2100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
		});

		it('should move backward', () => {
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				baseOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				baseOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 1900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 9, 10, 11, 12, 13],
				offsets: [2800, 2800, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 1700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 8, 9, 10, 11, 12, 13],
				offsets: [2800, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 1500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 1300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				baseOffset: 1100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				baseOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 4, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 3, 4, 5, 6],
				offsets: [1400, 1400, 1400, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 2, 3, 4, 5, 6],
				offsets: [1400, 1400, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				baseOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 1, 2, 3, 4, 5, 6],
				offsets: [1400, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				baseOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});

		it('should manage jumps', () => {
			list.moveTo(3);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(14);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 2100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveTo(11);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				baseOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveTo(0);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				baseOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});
	});
});
