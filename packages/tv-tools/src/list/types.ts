import type { FocusContainer } from '../focus';
import type { IEventListener } from '../utils/EventListener';
import type { Performance } from '../utils/Performance';

/**
 * Abstract information about elements that should be rendered by the UI.
 * The lists use render window and they reuse elements for more data.
 */
export interface RenderDataElement<T> {
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
	 * either visibility or opacity to not disturb the flow of elements.
	 */
	dataIndex: number;
	/**
	 * The item that is being rendered. This can be undefined if the item
	 * is outside of range. For performance reasons, we do not want to change
	 * the amount of elements rendered and it is preferred to keep them in the DOM,
	 * just hidden with CSS.
	 */
	item: T | undefined;
	/**
	 * Offset in terms of pixels that the element should be offset by.
	 * This is required for ANIMATED version of lists because the reused
	 * elements are being offset behind the current elements.
	 */
	offset: number;
	/**
	 * Listener for the element for when it gains a focus.
	 */
	onFocus: <T extends { target: null | EventTarget }>(event: T) => void;
}

/**
 * Information of how to render the list.
 */
export interface RenderData<T> {
	/**
	 * The elements to render.
	 */
	elements: RenderDataElement<T>[];
	/**
	 * The offset of the list to create the effect of scrolling in pixels.
	 */
	listOffset: number;
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
 * List implementation interface.
 */
export interface ListBehavior<T>
	extends IEventListener<{ dataIndex: number; renderData: RenderData<T> }> {
	/**
	 * Get current render data.
	 * @returns RenderData data for current rendering purposes
	 */
	getRenderData(): RenderData<T>;
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
	updateData(data: T[]): void;
}

/**
 * Configuration of lists that is needed for calculations.
 */
export interface ListSetup<
	T,
	ListConfiguration extends Record<string, unknown>,
> {
	/**
	 * Id of the List - this is usually provided by the related FocusContainer.
	 */
	id: string;
	/**
	 * The performance in which the list should run.
	 */
	performance: Performance;
	/**
	 * The maximum amount of elements that are being rendered at once.
	 */
	visibleElements: number;
	/**
	 * After updating the data, the list needs to find the old item
	 * in the new data and figure out whether the index of this item has changed.
	 * This is done to keep the same item in focus if we update the data of
	 * currently focused list.
	 * If not provided, the default comparison will use object reference equality.
	 * @param focusedItem - the item that is currently focused
	 * @param itemToCompare - the item from the new data to compare against
	 * @return true if the items are considered equal, false otherwise
	 */
	dataComparisonFunction?: (focusedItem: T, itemToCompare: T) => boolean;
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
	T,
	Configuration extends ListSetup<T, Record<string, unknown>> = ListSetup<
		T,
		Record<string, unknown>
	>,
> {
	new (
		focus: FocusContainer,
		configuration: Configuration,
		data: T[],
	): ListBehavior<T>;
}
