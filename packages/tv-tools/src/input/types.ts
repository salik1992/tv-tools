/**
 * Render data for the input component.
 * This interface defines the structure of the data used for rendering of the input.
 */
export interface RenderData {
	/**
	 * Whether the input is active, meaning typing will input text into it.
	 */
	active: boolean;
	/**
	 * Whether the placeholder text is rendered.
	 * If this is true, value will be equal to the placeholder text.
	 */
	placeholder: boolean;
	/**
	 * The visual text value of the input. It is not the actual value of the underlying
	 * input element. If the input type is password, only masking chars are passed.
	 * Similarly, if the placeholder is true, the value will be equal to the placeholder text.
	 */
	value: string;
	/**
	 * The position of the caret in the input. It will be either in char index or px,
	 * based on the type property of the render data.
	 */
	caret: number;
	/**
	 * The selection range of the input. It is an array of two numbers, where the First
	 * will always be smaller and second larger. The value will be either in char index
	 * or px, based on the type property of the render data.
	 */
	selection: [number, number] | null;
}

export interface CharRenderData extends RenderData {
	/**
	 * Signifies that the type of the render data is char, therefore the caret
	 * and selection values are in char index.
	 */
	type: 'char';
}

export interface PxRenderData extends RenderData {
	/**
	 * Signifies that the type of the render data is px, therefore the caret
	 * and selection values are in px.
	 */
	type: 'px';
}

/**
 * Events emitted by the input component.
 */
export type InputEvents = {
	renderData: CharRenderData;
};
