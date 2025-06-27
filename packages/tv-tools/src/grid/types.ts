import type {
	DataContainerBehavior,
	DataContainerImplementation,
	DataContainerSetup,
	RenderDataBase,
	RenderDataElementBase,
} from '../data-container';

/**
 * Abstract information about eleement that should be rendered by the UI.
 * The grids use render window and they reuse elements for more data.
 */
export type RenderDataElement<T> = RenderDataElementBase<T>;

/**
 * Abstract information about groups that should be rendered by the UI.
 * The grids use render window and they reuse groups for more data.
 */
export interface RenderDataGroup<T> {
	/**
	 * ID of the group. Not necessary needed to pass to the HTMLElement.
	 * But doing so may help with debugging and understanding the structure.
	 */
	id: string;
	/**
	 * The elements to render.
	 */
	elements: RenderDataElement<T>[];
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
export interface RenderData<T> extends RenderDataBase {
	/**
	 * The groups to render.
	 */
	groups: RenderDataGroup<T>[];
}

/**
 * Grid implementation interface.
 */
export type GridBehavior<T> = DataContainerBehavior<T, RenderData<T>>;

/**
 * Configuration of grids that is needed for calculations.
 */
export interface GridSetup<T, GridConfiguration extends Record<string, unknown>>
	extends DataContainerSetup<T, GridConfiguration> {
	/**
	 * The maximum amount of groups that are being rendered at once.
	 */
	visibleGroups: number;
	/**
	 * The number of elements per group.
	 */
	elementsPerGroup: number;
}

/**
 * Interface that creates an instance of GridBehavior.
 */
export type GridImplementation<
	T,
	Configuration extends GridSetup<T, Record<string, unknown>> = GridSetup<
		T,
		Record<string, unknown>
	>,
> = DataContainerImplementation<T, Configuration, GridBehavior<T>>;
