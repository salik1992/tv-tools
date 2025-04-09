import { isRtl } from '../utils/isRtl';
import type { CharRenderData, PxRenderData } from './types';

/**
 * Converts the char render data to px render data.
 * This is used to position the caret and selection in the input component.
 * @param renderData The char render data to be converted.
 * @param textNode The text node that is used to render the input text.
 * @returns The px render data.
 */
export function charRenderDataToPxRenderData(
	renderData: CharRenderData | undefined,
	textNode: ChildNode | null | undefined,
): PxRenderData {
	if (!renderData) {
		// If the render data is undefined, return default px render data
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
		// If the text node is null, return default px render data
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
	// Update the text node with the current value and avoid delay from rendering libraries.
	textNode.textContent = renderData.value;
	// Create a range to get the bounding rect of the text node and positions the caret
	const range = document.createRange();
	range.selectNode(textNode);
	// Measure the whole text node to get the bounding rect of the text node
	const wholeText = range.getBoundingClientRect();
	range.setStart(textNode, renderData.caret);
	range.setEnd(textNode, renderData.caret);
	// Measure the caret position to get the bounding rect of the caret
	const caret = range.getBoundingClientRect();
	const caretPosition = isRtl()
		? wholeText.left - caret.left
		: wholeText.left + caret.width - caret.left;
	// Measure the selection range to get the bounding rect of the selection
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
