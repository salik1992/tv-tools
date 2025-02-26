import type { FocusContainer } from '../focus';
import { clamp } from '../utils/clamp';
import { EventListener } from '../utils/EventListener';
import { Performance } from '../utils/Performance';
import type { DataChange, ListBehavior, ListSetup, RenderData } from './types';

/**
 * The base for all ListBehavior implementations.
 */
export abstract class ListBase<
	ListConfiguration extends Record<string, unknown>,
> implements ListBehavior
{
	/**
	 * Handles listeners to events and their management.
	 */
	private events = new EventListener<{ dataIndex: number }>();

	/**
	 * Render data that contain the information of what should be rendered.
	 */
	protected renderData: RenderData;

	/**
	 * The current index to data.
	 */
	protected dataIndex = 0;

	constructor(
		/**
		 * FocusContainer that is rendered at the base of the list and provides focus
		 * functionality for the list.
		 */
		protected focus: FocusContainer,
		/**
		 * Configuration of the list.
		 */
		protected c: ListSetup<ListConfiguration>,
	) {
		if (c.navigatableElements > c.visibleElements) {
			throw new Error(
				'visibleElements must be same or larger than navigatableElements, recommended value is 2 or 4 larger.',
			);
		}
		const elementsLength =
			c.dataLength > c.visibleElements ? c.visibleElements : c.dataLength;
		// Creates the initial render data.
		this.renderData = {
			listOffset: 0,
			elements: (() => {
				const array = [];
				for (let i = 0; i < elementsLength; i++) {
					array.push({
						id: `${c.id}-${i}`,
						dataIndex: i,
						offset: 0,
					});
				}
				return array;
			})(),
		};
		// Move to the initial index with a moveTo function to reuse
		// the calculations.
		if (typeof c.initialIndex === 'number' && c.initialIndex > 0) {
			this.moveTo(c.initialIndex);
		}
	}

	/**
	 * @link EventListener.addEventListener
	 */
	public addEventListener = this.events.addEventListener;

	/**
	 * @link EventListener.addEventListener
	 */
	public removeEventListener = this.events.removeEventListener;

	/**
	 * Returns the current render data
	 * @returns RenderData data for rendering
	 */
	public getRenderData(): RenderData {
		return this.renderData;
	}

	/**
	 * Update the data by adding/removing new data to start/end.
	 * @param change - the change data defining what is changed
	 * @returns RenderData - updated render data
	 */
	public updateDataLength({ start, end }: DataChange): RenderData {
		throw new Error('Not implemented');
	}

	/**
	 * Move the focus by diff in the index in data. This function will clamp the
	 * resulting index between 0 and the current known data length.
	 * @param diff - the difference by which it should move
	 * @returns RenderData data for rendering after the move has been calculated
	 */
	public moveBy(diff: number, fromId?: string): RenderData {
		const fromDataIndexElement = this.renderData.elements.find(
			({ id }) => id === fromId,
		);
		if (fromDataIndexElement) {
			this.dataIndex = fromDataIndexElement.dataIndex;
		}
		return this.moveTo(this.dataIndex + diff);
	}

	/**
	 * Move the focus to the index in data. This function will clamp this value
	 * between 0 and the current known data length.
	 * @param index - the index to move to
	 * @returns RenderData data for rendering after the move has been calculated
	 */
	public moveTo(index: number): RenderData {
		const newIndex = clamp(0, index, this.c.dataLength - 1);
		if (newIndex !== this.dataIndex) {
			this.renderData = this.move(newIndex);
			this.events.triggerEvent('dataIndex', this.dataIndex);
			this.dataIndex = newIndex;
			this.focusChildOfDataIndex(newIndex);
		}
		return this.renderData;
	}

	/**
	 * The actual function that calculates the new render data to be used.
	 * @param newIndex - the new data index that should be focused
	 * @returns RenderData - the updated render data
	 */
	protected abstract move(newIndex: number): RenderData;

	/**
	 * Util to return whether the list should animate the scroll.
	 * @returns boolean - true for animate, false for not
	 */
	protected isAnimated() {
		return this.c.performance === Performance.ANIMATED;
	}

	/**
	 * Focuses the child element based by dataIndex that is rendered.
	 * @param dataIndexToFocus - index in data that should be focused
	 */
	private focusChildOfDataIndex(dataIndexToFocus: number) {
		const element = this.renderData.elements.find(
			({ dataIndex }) => dataIndex === dataIndexToFocus,
		);
		if (element) {
			this.focus.focusChild(element.id, { preventScroll: true });
		}
	}
}
