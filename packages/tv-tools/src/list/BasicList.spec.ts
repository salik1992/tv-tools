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
		const list = new BasicList(container, {
			id: 'list',
			performance: Performance.BASIC,
			dataLength: 15,
			visibleElements: 7,
			config: {
				navigatableElements: 5,
				scrolling: {
					first: 100,
					other: 200,
				},
			},
		});

		it('should render list at index 0', () => {
			assertRenderData(list.getRenderData(), focusSpy, {
				listOffset: 0,
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
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [1, 2, 3, 4, 5, 6, 7],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [2, 3, 4, 5, 6, 7, 8],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [3, 4, 5, 6, 7, 8, 9],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [4, 5, 6, 7, 8, 9, 10],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [5, 6, 7, 8, 9, 10, 11],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [6, 7, 8, 9, 10, 11, 12],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [8, 9, 10, 11, 12, 13, 14],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [9, 10, 11, 12, 13, 14, 15],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				listOffset: 100,
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
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [9, 10, 11, 12, 13, 14, 15],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [8, 9, 10, 11, 12, 13, 14],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [6, 7, 8, 9, 10, 11, 12],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [5, 6, 7, 8, 9, 10, 11],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [4, 5, 6, 7, 8, 9, 10],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [3, 4, 5, 6, 7, 8, 9],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [2, 3, 4, 5, 6, 7, 8],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [1, 2, 3, 4, 5, 6, 7],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 0,
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
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(14);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(11);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [10, 11, 12, 13, 14, 15, 16],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(0);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});
	});

	describe('Performance.ANIMATED', () => {
		const list = new BasicList(container, {
			id: 'list',
			performance: Performance.ANIMATED,
			dataLength: 15,
			visibleElements: 7,
			config: {
				navigatableElements: 5,
				scrolling: {
					first: 100,
					other: 200,
				},
			},
		});

		it('should render list at index 0', () => {
			assertRenderData(list.getRenderData(), focusSpy, {
				listOffset: 0,
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
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				listOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 1, 2, 3, 4, 5, 6],
				offsets: [1400, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				listOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 2, 3, 4, 5, 6],
				offsets: [1400, 1400, 0, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 3, 4, 5, 6],
				offsets: [1400, 1400, 1400, 0, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 4, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 0, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 1100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 0, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				listOffset: 1300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 0],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 1500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				listOffset: 1700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 8, 9, 10, 11, 12, 13],
				offsets: [2800, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				listOffset: 1900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 9, 10, 11, 12, 13],
				offsets: [2800, 2800, 1400, 1400, 1400, 1400, 1400],
			});
			expect(list.moveBy(1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 2100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			expect(list.moveBy(1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				listOffset: 2100,
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
				listOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				listOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				listOffset: 1900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 9, 10, 11, 12, 13],
				offsets: [2800, 2800, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 1700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 8, 9, 10, 11, 12, 13],
				offsets: [2800, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 1500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 13],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 1400],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 1300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 12, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 1400, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-6',
				listOffset: 1100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 11, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 1400, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-5',
				listOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 10, 4, 5, 6],
				offsets: [1400, 1400, 1400, 1400, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 9, 3, 4, 5, 6],
				offsets: [1400, 1400, 1400, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-3',
				listOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 8, 2, 3, 4, 5, 6],
				offsets: [1400, 1400, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-2',
				listOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [7, 1, 2, 3, 4, 5, 6],
				offsets: [1400, 0, 0, 0, 0, 0, 0],
			});
			list.moveBy(-1);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-1',
				listOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(true);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			expect(list.moveBy(-1)).toBe(false);
			assertRenderData(list.getRenderData(), focusSpy, {
				listOffset: 0,
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
				listOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
			list.moveTo(14);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 2100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveTo(11);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-4',
				listOffset: 2100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [14, 15, 16, 10, 11, 12, 13],
				offsets: [2800, 2800, 2800, 1400, 1400, 1400, 1400],
			});
			list.moveTo(0);
			assertRenderData(list.getRenderData(), focusSpy, {
				focus: 'list-0',
				listOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [0, 1, 2, 3, 4, 5, 6],
				offsets: [0, 0, 0, 0, 0, 0, 0],
			});
		});
	});
});
