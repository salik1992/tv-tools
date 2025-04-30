import type { FocusContainer } from '../focus';
import type { IEventListener } from '../utils/EventListener';
import type { Performance } from '../utils/Performance';

/**
 * Abstract information about eleement that should be rendered by the UI.
 * The grids use render window and they reuse elements for more data.
 */
export interface RenderDataElement {
	/**
	 * ID to be passed as `id` attribute to HTMLElement. This is required
	 * to recognize the current focused element in order to know where to
	 * navigate in the grid. It will also be used by focus management to
	 * simplify debugging.
	 */
	id: string;
	/**
	 * Index of data that should be rendered by the element. Please note,
	 * that the index may point to undefined data. It is generally required
	 * to still render the element for positional purposes and hide it with
	 * either visibility or opacity to not disturb the flow of elements.
	 */
	dataIndex: number;
	/**
	 * Listener for the element for when it gains a focus.
	 */
	onFocus: <T extends { target: null | EventTarget }>(event: T) => void;
}

/**
 * Abstract information about groups that should be rendered by the UI.
 * The grids use render window and they reuse groups for more data.
 */
export interface RenderDataGroup {
	/**
	 * ID of the group. Not necessary needed to pass to the HTMLElement.
	 * But doing so may help with debugging and understanding the structure.
	 */
	id: string;
	/**
	 * The elements to render.
	 */
	elements: RenderDataElement[];
	/**
	 * Offset in terms of pixels that the group should be offset by.
	 * This is required for ANIMATED version of grids because the reused
	 * groups are being offset behind the current elements.
	 */
	offset: number;
}

/**
 * Information of how to render the grid.
 */
export interface RenderData {
	/**
	 * The groups to render.
	 */
	groups: RenderDataGroup[];
	/**
	 * The offset of the grid to create the effect of scrolling in pixels.
	 */
	gridOffset: number;
	/**
	 * Whether the previous arrow for pointer navigation should be visible.
	 */
	previousArrow: boolean;
	/**
	 * Whether the next arrow for pointer navigation should be visible.
	 */
	nextArrow: boolean;
}

/**
 * Interface for adding/removing elements from data passed to grid.
 * This will help to keep the grid aligned to the same data if possible.
 */
export type DataChange = { start?: number; end?: number };

/**
 * Grid implementation interface.
 */
export interface GridBehavior
	extends IEventListener<{ dataIndex: number; renderData: RenderData }> {
	/**
	 * Get current render data.
	 * @returns RenderData data for current rendering purposes
	 */
	getRenderData(): RenderData;
	/**
	 * Move the focus to the index in data. This function will clamp this value
	 * between 0 and the current known data length.
	 * @param index - the index to move to
	 * @returns true if the move was successful, false otherwise
	 */
	moveTo(index: number): boolean;
	/**
	 * Move the focus by diff in the index in data. This function will clamp the
	 * resulting index between 0 and the current known data length.
	 * @param diff - the difference by which it should move
	 * @returns true if the move was successful, false otherwise
	 */
	moveBy(diff: number, fromId?: string): boolean;
	/**
	 * Change the data length by adding/removing items at the start/end of data.
	 * @param change - how many items to add/remove at the start/end of data
	 * @returns RenderData the new render data as recalculated based on new data
	 */
	updateDataLength(change: DataChange): void;
}

/**
 * Configuration of grids that is needed for calculations.
 */
export interface GridSetup<GridConfiguration extends Record<string, unknown>> {
	/**
	 * Id of the Grid - this is usually provided by the related FocusContainer.
	 */
	id: string;
	/**
	 * The performance in which the grid should run.
	 */
	performance: Performance;
	/**
	 * The length of data being rendered in the grid.
	 */
	dataLength: number;
	/**
	 * The maximum amount of groups that are being rendered at once.
	 */
	visibleGroups: number;
	/**
	 * The number of elements per group.
	 */
	elementsPerGroup: number;
	/**
	 * The initial index in data to focus.
	 */
	initialIndex?: number;
	/**
	 * GridImplementation specific configuration.
	 */
	config: GridConfiguration;
}

/**
 * Interface that creates an instance of GridBehavior.
 */
export interface GridImplementation<
	Configuration extends GridSetup<Record<string, unknown>> = GridSetup<
		Record<string, unknown>
	>,
> {
	new (focus: FocusContainer, configuration: Configuration): GridBehavior;
}
