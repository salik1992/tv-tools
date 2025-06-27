import { toKeys } from '../utils/toKeys';
import type { RenderData } from './types';

export const assertRenderData = (
	renderData: RenderData<string>,
	focusSpy: jest.SpyInstance,
	assertion: Partial<{
		focus: string;
		baseOffset: number;
		nextArrow: boolean;
		previousArrow: boolean;
		ids: string[];
		dataIndices: number[];
		offsets: number[];
	}>,
) => {
	for (const key of toKeys(assertion)) {
		switch (key) {
			case 'focus':
				if (assertion.focus) {
					expect(focusSpy).toHaveBeenCalledWith(assertion.focus, {
						preventScroll: true,
					});
				}
				break;
			case 'baseOffset':
				if (assertion.baseOffset !== renderData.baseOffset) {
					console.log('throwing');
					throw new Error(
						`Expected baseOffset to be ${assertion.baseOffset} but got ${renderData.baseOffset}`,
					);
				}
				break;
			case 'nextArrow':
				if (assertion.nextArrow !== renderData.nextArrow) {
					throw new Error(
						`Expected nextArrow to be ${assertion.nextArrow} but got ${renderData.nextArrow}`,
					);
				}
				break;
			case 'previousArrow':
				if (assertion.previousArrow !== renderData.previousArrow) {
					throw new Error(
						`Expected previousArrow to be ${assertion.previousArrow} but got ${renderData.previousArrow}`,
					);
				}
				break;
			case 'ids':
				if (assertion.ids) {
					for (let i = 0; i < assertion.ids.length; i++) {
						if (assertion.ids[i] !== renderData.elements[i].id) {
							throw new Error(
								`Expected id ${assertion.ids[i]} at index ${i} but got ${renderData.elements[i].id}`,
							);
						}
					}
				}
				break;
			case 'dataIndices':
				if (assertion.dataIndices) {
					for (let i = 0; i < assertion.dataIndices.length; i++) {
						if (
							assertion.dataIndices[i] !==
							renderData.elements[i].dataIndex
						) {
							console.log(
								assertion.dataIndices,
								renderData.elements.map(
									({ dataIndex }) => dataIndex,
								),
							);
							throw new Error(
								`Expected dataIndex ${assertion.dataIndices[i]} at index ${i} but got ${renderData.elements[i].dataIndex}`,
							);
						}
					}
				}
				break;
			case 'offsets':
				if (assertion.offsets) {
					for (let i = 0; i < assertion.offsets.length; i++) {
						if (
							assertion.offsets[i] !==
							renderData.elements[i].offset
						) {
							throw new Error(
								`Expected offset ${assertion.offsets[i]} at index ${i} but got ${renderData.elements[i].offset}`,
							);
						}
					}
				}
				break;
		}
	}
	focusSpy.mockClear();
};
