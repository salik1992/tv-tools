import { FocusContainer, FocusManager } from '../focus';
import { Performance } from '../utils/Performance';
import { BasicGrid } from './BasicGrid';
import { assertRenderData } from './mocks';

describe('BasicGrid', () => {
	const focus = new FocusManager();
	const container = new FocusContainer(focus);
	const focusSpy = jest
		.spyOn(container, 'focusChild')
		.mockImplementation(() => {});

	describe('Performance.BASIC', () => {
		const grid = new BasicGrid(container, {
			id: 'grid',
			performance: Performance.BASIC,
			dataLength: 35,
			elementsPerGroup: 5,
			visibleGroups: 5,
			config: {
				navigatableGroups: 3,
				scrolling: {
					first: 100,
					other: 200,
				},
			},
		});

		it('should render grid at index 0', () => {
			assertRenderData(grid.getRenderData(), focusSpy, {
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				ids: [
					[
						'grid-g0',
						[
							'grid-g0-e0',
							'grid-g0-e1',
							'grid-g0-e2',
							'grid-g0-e3',
							'grid-g0-e4',
						],
					],
					[
						'grid-g1',
						[
							'grid-g1-e0',
							'grid-g1-e1',
							'grid-g1-e2',
							'grid-g1-e3',
							'grid-g1-e4',
						],
					],
					[
						'grid-g2',
						[
							'grid-g2-e0',
							'grid-g2-e1',
							'grid-g2-e2',
							'grid-g2-e3',
							'grid-g2-e4',
						],
					],
					[
						'grid-g3',
						[
							'grid-g3-e0',
							'grid-g3-e1',
							'grid-g3-e2',
							'grid-g3-e3',
							'grid-g3-e4',
						],
					],
					[
						'grid-g4',
						[
							'grid-g4-e0',
							'grid-g4-e1',
							'grid-g4-e2',
							'grid-g4-e3',
							'grid-g4-e4',
						],
					],
				],
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
		});

		it('should move forward', () => {
			expect(grid.moveBy(1)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e1',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e1',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e4',
				gridOffset: 100,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			expect(grid.moveBy(5)).toBe(false);
			expect(focusSpy).not.toHaveBeenCalledTimes(5);
		});

		it('should move backwards', () => {
			expect(grid.moveBy(-1)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e3',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			expect(grid.moveBy(-5)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e0',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			expect(grid.moveBy(-5)).toBe(false);
		});

		it('should manage jumps', () => {
			grid.moveTo(3);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e3',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(20);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e0',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(32);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e2',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(17);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e2',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e0',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(0);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e0',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
		});
	});

	describe('Performance.ANIMATED', () => {
		const grid = new BasicGrid(container, {
			id: 'grid',
			performance: Performance.ANIMATED,
			dataLength: 35,
			elementsPerGroup: 5,
			visibleGroups: 5,
			config: {
				navigatableGroups: 3,
				scrolling: {
					first: 100,
					other: 200,
				},
			},
		});

		it('should render grid at index 0', () => {
			assertRenderData(grid.getRenderData(), focusSpy, {
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				ids: [
					[
						'grid-g0',
						[
							'grid-g0-e0',
							'grid-g0-e1',
							'grid-g0-e2',
							'grid-g0-e3',
							'grid-g0-e4',
						],
					],
					[
						'grid-g1',
						[
							'grid-g1-e0',
							'grid-g1-e1',
							'grid-g1-e2',
							'grid-g1-e3',
							'grid-g1-e4',
						],
					],
					[
						'grid-g2',
						[
							'grid-g2-e0',
							'grid-g2-e1',
							'grid-g2-e2',
							'grid-g2-e3',
							'grid-g2-e4',
						],
					],
					[
						'grid-g3',
						[
							'grid-g3-e0',
							'grid-g3-e1',
							'grid-g3-e2',
							'grid-g3-e3',
							'grid-g3-e4',
						],
					],
					[
						'grid-g4',
						[
							'grid-g4-e0',
							'grid-g4-e1',
							'grid-g4-e2',
							'grid-g4-e3',
							'grid-g4-e4',
						],
					],
				],
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
		});

		it('should move forward', () => {
			expect(grid.moveBy(1)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e1',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e1',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e1',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g3-e1',
				gridOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 0, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g4-e1',
				gridOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 0, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e1',
				gridOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 0, 0],
			});
			grid.moveBy(5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e1',
				gridOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 1000, 0],
			});
			expect(grid.moveBy(5)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e4',
				gridOffset: 900,
				nextArrow: false,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 1000, 0],
			});
			expect(grid.moveBy(5)).toBe(false);
		});

		it('should move backwards', () => {
			expect(grid.moveBy(-1)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 1000, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e3',
				gridOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 1000, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g4-e3',
				gridOffset: 700,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g3-e3',
				gridOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g2-e3',
				gridOffset: 300,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveBy(-5);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e3',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			expect(grid.moveBy(-5)).toBe(true);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e0',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			expect(grid.moveBy(-5)).toBe(false);
		});

		it('should manage jumps', () => {
			grid.moveTo(3);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e3',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(20);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g4-e0',
				gridOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 0, 0, 0],
			});
			grid.moveTo(32);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e2',
				gridOffset: 900,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[35, 36, 37, 38, 39],
					[40, 41, 42, 43, 44],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 1000, 1000, 0],
			});
			grid.moveTo(17);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g3-e2',
				gridOffset: 500,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[25, 26, 27, 28, 29],
					[30, 31, 32, 33, 34],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [1000, 1000, 0, 0, 0],
			});
			grid.moveTo(8);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g1-e3',
				gridOffset: 100,
				nextArrow: true,
				previousArrow: true,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
			grid.moveTo(0);
			assertRenderData(grid.getRenderData(), focusSpy, {
				focus: 'grid-g0-e0',
				gridOffset: 0,
				nextArrow: true,
				previousArrow: false,
				dataIndices: [
					[0, 1, 2, 3, 4],
					[5, 6, 7, 8, 9],
					[10, 11, 12, 13, 14],
					[15, 16, 17, 18, 19],
					[20, 21, 22, 23, 24],
				],
				offsets: [0, 0, 0, 0, 0],
			});
		});
	});
});
