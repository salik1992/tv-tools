import { FocusContainer } from '../focus';
import type { IEventListener } from '../utils/EventListener';
import type { Performance } from '../utils/Performance';

/**
 * Abstract information about elements that should be rendered by the UI.
 * The lists use render window and they reuse elements for more data.
 */
export interface RenderDataElement {
	/**
	 * ID to be passed as `id` attribute to HTMLElement. This is required
	 * to recognize the current focused element in order to know where to
	 * navigate in the list. It will also be used by focus management to
	 * simplify debugging.
	 */
	id: string;
	/**
	 * Index of data that should be rendered by the element. Please note,
	 * that the index may point to undefined data. It is generally required
	 * to still render the element for positional purposes and hide it with
	 * either visibility or opaacity to not disturb the flow of elements.
	 */
	dataIndex: number;
	/**
	 * Offset in terms of pixels that the element should be offset by.
	 * This is required for ANIMATED version of lists because the reused
	 * elements are being offset behind the current elements.
	 */
	offset: number;
}

/**
 * Information of how to render the list.
 */
export interface RenderData {
	/**
	 * The elements to render.
	 */
	elements: RenderDataElement[];
	/**
	 * The offset of the list to create the effect of scrolling in pixels.
	 */
	listOffset: number;
}

/**
 * Interface for adding/removing elements from data passed to list.
 * This will help to keep the list aligned to the same data if possible.
 */
export type DataChange = { start?: number; end?: number };

/**
 * List implementation interface.
 */
export interface ListBehavior extends IEventListener<{ dataIndex: number }> {
	/**
	 * Get current render data.
	 * @returns RenderData data for current rendering purposes
	 */
	getRenderData(): RenderData;
	/**
	 * Move the focus to the index in data. This function will clamp this value
	 * between 0 and the current known data length.
	 * @param index - the index to move to
	 * @returns RenderData data for rendering after the move has been calculated
	 */
	moveTo(index: number): RenderData;
	/**
	 * Move the focus by diff in the index in data. This function will clamp the
	 * resulting index between 0 and the current known data length.
	 * @param diff - the difference by which it should move
	 * @returns RenderData data for rendering after the move has been calculated
	 */
	moveBy(diff: number, fromId?: string): RenderData;
	/**
	 * Change the data length by adding/removing items at the start/end of data.
	 * @param change - how many items to add/remove at the start/end of data
	 * @returns RenderData the new render data as recalculated based on new data
	 */
	updateDataLength(change: DataChange): void;
}

/**
 * Configuration of lists that is needed for calculations.
 */
export interface ListSetup<ListConfiguration extends Record<string, unknown>> {
	/**
	 * Id of the List - this is usually provided by the related FocusContainer.
	 */
	id: string;
	/**
	 * The performance in which the list should run.
	 */
	performance: Performance;
	/**
	 * The length of data being rendered in the list.
	 */
	dataLength: number;
	/**
	 * The maximum amount of elements that are being rendered at once.
	 */
	visibleElements: number;
	/**
	 * The number of elements which are focusable. The rule of thumb is usually
	 * navigatableElements + 2 === visibleElements
	 */
	navigatableElements: number;
	/**
	 * The initial index in data to focus.
	 */
	initialIndex?: number;
	/**
	 * ListImplementation specific configuration.
	 */
	config: ListConfiguration;
}

/**
 * Interface that creates an instance of ListBehavior.
 */
export interface ListImplementation<
	Configuration extends ListSetup<{}> = ListSetup<{}>,
> {
	new (focus: FocusContainer, configuration: Configuration): ListBehavior;
}
