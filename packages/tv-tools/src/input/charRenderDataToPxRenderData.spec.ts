import { charRenderDataToPxRenderData } from './charRenderDataToPxRenderData';

// @ts-expect-error: mock
Range.prototype.getBoundingClientRect = jest.fn(() => ({
	left: 100,
	top: 0,
	right: 0,
	bottom: 0,
	width: 25,
	height: 0,
	x: 0,
	y: 0,
}));

describe('charRenderDataToPxRenderData', () => {
	it('should return default px render data when renderData is undefined', () => {
		const result = charRenderDataToPxRenderData(undefined, null);
		expect(result).toEqual({
			type: 'px',
			active: false,
			placeholder: false,
			value: '',
			caret: 0,
			selection: null,
		});
	});

	it('should return default px render data when textNode is null', () => {
		const renderData = {
			type: 'char' as const,
			active: true,
			placeholder: false,
			value: 'test',
			caret: 2,
			selection: [1, 3] as [number, number],
		};
		const result = charRenderDataToPxRenderData(renderData, null);
		expect(result).toEqual({
			type: 'px',
			active: true,
			placeholder: false,
			value: 'test',
			caret: 2,
			selection: [1, 2],
		});
	});

	it('should return px render data with updated text node', () => {
		const renderData = {
			type: 'char' as const,
			active: true,
			placeholder: false,
			value: 'test',
			caret: 2,
			selection: [1, 3] as [number, number],
		};
		const parentNode = document.createElement('div');
		const textNode = document.createTextNode('test');
		parentNode.appendChild(textNode);
		const result = charRenderDataToPxRenderData(renderData, textNode);
		expect(result).toEqual({
			type: 'px',
			active: true,
			placeholder: false,
			value: 'test',
			caret: 25,
			selection: [0, 25],
		});
	});
});
