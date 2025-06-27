import type {
	DataContainerBehavior,
	DataContainerImplementation,
	DataContainerSetup,
	RenderDataBase,
	RenderDataElementBase,
} from '../data-container';

/**
 * Abstract information about elements that should be rendered by the UI.
 * The lists use render window and they reuse elements for more data.
 */
export interface RenderDataElement<T> extends RenderDataElementBase<T> {
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
export interface RenderData<T> extends RenderDataBase {
	/**
	 * The elements to render.
	 */
	elements: RenderDataElement<T>[];
}

/**
 * List implementation interface.
 */
export type ListBehavior<T> = DataContainerBehavior<T, RenderData<T>>;

/**
 * Configuration of lists that is needed for calculations.
 */
export interface ListSetup<T, ListConfiguration extends Record<string, unknown>>
	extends DataContainerSetup<T, ListConfiguration> {
	/**
	 * The maximum amount of elements that are being rendered at once.
	 */
	visibleElements: number;
}

/**
 * Interface that creates an instance of ListBehavior.
 */
export type ListImplementation<
	T,
	Configuration extends ListSetup<T, Record<string, unknown>> = ListSetup<
		T,
		Record<string, unknown>
	>,
> = DataContainerImplementation<T, Configuration, ListBehavior<T>>;
