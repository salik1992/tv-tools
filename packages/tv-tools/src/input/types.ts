declare global {
	interface DocumentEventMap {
		keyboardStateChange: { detail?: { visibility: boolean } };
	}
}

export interface RenderData {
	active: boolean;
	placeholder: boolean;
	value: string;
	caret: number;
	selection: [number, number] | null;
}

export interface CharRenderData extends RenderData {
	type: 'char';
}

export interface PxRenderData extends RenderData {
	type: 'px';
}

export type InputEvents = {
	renderData: CharRenderData;
};
