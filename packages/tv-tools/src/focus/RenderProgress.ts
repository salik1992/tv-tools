/**
 * Rendering phase of the component that should hopefully match somehow to most
 * of the UI frameworks.
 */
export enum RenderProgress {
	/**
	 * Initial phase when the UI is built top-down either initially or in the update loop.
	 * "render" phase in react for example
	 */
	STARTED,
	/**
	 * Middle phase when the children components are being finished and they
	 * announce themselves to the container.
	 * "componentDidMount" phase in children in react for example
	 */
	CHILDREN,
	/**
	 * Final phase when the container itself is ready and we have the full list
	 * of children and we can commit the new list.
	 * "componentDidMount" phase in container in react for example
	 */
	FINISHED,
}
