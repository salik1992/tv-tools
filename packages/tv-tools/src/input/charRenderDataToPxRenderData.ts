import { isRtl } from '../utils/isRtl';
import type { CharRenderData, PxRenderData } from './types';

export function charRenderDataToPxRenderData(
	renderData: CharRenderData | undefined,
	textNode: ChildNode | null | undefined,
): PxRenderData {
	if (!renderData) {
		return {
			type: 'px',
			active: false,
			placeholder: false,
			value: '',
			caret: 0,
			selection: null,
		};
	}
	if (!textNode) {
		return {
			type: 'px',
			active: renderData.active,
			placeholder: renderData.placeholder,
			value: renderData.value,
			caret: renderData.caret,
			selection: renderData.selection
				? [
						renderData.selection[0],
						renderData.selection[1] - renderData.selection[0],
					]
				: null,
		};
	}
	textNode.textContent = renderData.value;
	const range = document.createRange();
	range.selectNode(textNode);
	const wholeText = range.getBoundingClientRect();
	range.setStart(textNode, renderData.caret);
	range.setEnd(textNode, renderData.caret);
	const caret = range.getBoundingClientRect();
	const caretPosition = isRtl()
		? wholeText.left - caret.left
		: wholeText.left + caret.width - caret.left;
	range.setStart(textNode, renderData.selection?.[0] ?? renderData.caret);
	range.setEnd(textNode, renderData.selection?.[1] ?? renderData.caret);
	const selection = range.getBoundingClientRect();
	return {
		type: 'px',
		active: renderData.active,
		placeholder: renderData.placeholder,
		value: renderData.value,
		caret: caretPosition,
		selection: renderData.selection
			? [wholeText.left - selection.left, selection.width]
			: null,
	};
}
