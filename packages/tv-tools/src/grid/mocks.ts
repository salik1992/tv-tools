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
		ids: [string, string[]][];
		dataIndices: number[][];
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
						if (assertion.ids[i][0] !== renderData.groups[i].id) {
							throw new Error(
								`Expected group id ${assertion.ids[i][0]} at index ${i} but got ${renderData.groups[i].id}`,
							);
						}
						for (let j = 0; j < assertion.ids[i][1].length; j++) {
							if (
								assertion.ids[i][1][j] !==
								renderData.groups[i].elements[j].id
							) {
								throw new Error(
									`Expected element id ${assertion.ids[i][1][j]} at index ${j} but got ${renderData.groups[i].elements[j].id}`,
								);
							}
						}
					}
				}
				break;
			case 'dataIndices':
				if (assertion.dataIndices) {
					for (let i = 0; i < assertion.dataIndices.length; i++) {
						for (
							let j = 0;
							j < assertion.dataIndices[i].length;
							j++
						) {
							if (
								assertion.dataIndices[i][j] !==
								renderData.groups[i].elements[j].dataIndex
							) {
								throw new Error(
									`Expected dataIndex ${assertion.dataIndices[i][j]} at index ${j} but got ${renderData.groups[i].elements[j].dataIndex}`,
								);
							}
						}
					}
				}
				break;
			case 'offsets':
				if (assertion.offsets) {
					for (let i = 0; i < assertion.offsets.length; i++) {
						if (
							assertion.offsets[i] !== renderData.groups[i].offset
						) {
							throw new Error(
								`Expected offset ${assertion.offsets[i]} at index ${i} but got ${renderData.groups[i].offset}`,
							);
						}
					}
					break;
				}
		}
		focusSpy.mockClear();
	}
};
