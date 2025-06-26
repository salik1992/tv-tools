import type { FocusContainer } from '../focus';
import { EventListener } from '../utils/EventListener';
import { Performance } from '../utils/Performance';
import { clamp } from '../utils/clamp';
import type { ListBehavior, ListSetup, RenderData } from './types';

/**
 * The base for all ListBehavior implementations.
 */
export abstract class ListBase<
	T,
	ListConfiguration extends Record<string, unknown>,
> implements ListBehavior<T>
{
	/**
	 * Handles listeners to events and their management.
	 */
	protected events = new EventListener<{
		dataIndex: number;
		renderData: RenderData<T>;
	}>();

	/**
	 * Stores focus listeners for the elements.
	 */
	protected focusListeners = new Map<
		string,
		<E extends { target: null | EventTarget }>(event: E) => void
	>();

	/**
	 * Render data that contain the information of what should be rendered.
	 */
	protected renderData: RenderData<T>;

	/**
	 * The current index to data.
	 */
	protected dataIndex = 0;

	public constructor(
		/**
		 * FocusContainer that is rendered at the base of the list and provides focus
		 * functionality for the list.
		 */
		protected focus: FocusContainer,
		/**
		 * Configuration of the list.
		 */
		protected c: ListSetup<T, ListConfiguration>,
		/**
		 * The data that should be rendered.
		 */
		protected data: T[],
	) {
		// Creates the initial render data.
		this.renderData = {
			listOffset: 0,
			previousArrow: false,
			nextArrow: this.data.length > 0,
			elements: (() => {
				const array = [];
				for (let i = 0; i < c.visibleElements; i++) {
					const id = `${c.id}-${i}`;
					array.push({
						id,
						dataIndex: i,
						item: this.data[i],
						offset: 0,
						onFocus: this.getOnFocusForElement(id),
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
	public getRenderData(): RenderData<T> {
		return this.renderData;
	}

	/**
	 * Update the data that are rendered.
	 * @param data - the new data to be rendered
	 */
	public updateData(newData: T[]) {
		const indexInNewData = newData.findIndex(this.compareData);
		this.data = newData;
		if (indexInNewData === -1) {
			this.moveTo(0);
		} else if (indexInNewData !== this.dataIndex) {
			this.moveTo(indexInNewData);
		} else {
			this.renderData = this.move(this.dataIndex);
			this.events.triggerEvent('renderData', this.renderData);
		}
	}

	/**
	 * Move the focus by diff in the index in data. This function will clamp the
	 * resulting index between 0 and the current known data length.
	 * @param diff - the difference by which it should move
	 * @returns true if the move was successful, false otherwise
	 */
	public moveBy(diff: number, fromId?: string) {
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
	 * @returns true if the move was successful, false otherwise
	 */
	public moveTo(index: number) {
		const newIndex = clamp(0, index, this.data.length - 1);
		if (newIndex !== this.dataIndex) {
			this.renderData = this.move(newIndex);
			this.events.triggerEvent('renderData', this.renderData);
			this.dataIndex = newIndex;
			this.events.triggerEvent('dataIndex', this.dataIndex);
			this.focusChildOfDataIndex(newIndex);
			return true;
		}
		return false;
	}

	/**
	 * The actual function that calculates the new render data to be used.
	 * @param newIndex - the new data index that should be focused
	 * @returns RenderData - the updated render data
	 */
	protected abstract move(newIndex: number): RenderData<T>;

	/**
	 * Util to return whether the list should animate the scroll.
	 * @returns boolean - true for animate, false for not
	 */
	protected isAnimated() {
		return this.c.performance === Performance.ANIMATED;
	}

	/**
	 * Returns an onFocus listener for element of certain id.
	 * @param id - id of the element
	 * @returns focus listener
	 */
	protected getOnFocusForElement(id: string) {
		const listener =
			this.focusListeners.get(id) ??
			(<T extends { target: null | EventTarget }>(event: T) => {
				if ((event.target as HTMLElement).id === id) {
					const element = this.renderData.elements.find(
						(e) => e.id === id,
					);
					if (element) {
						this.moveTo(element.dataIndex);
					}
				}
			});
		if (!this.focusListeners.has(id)) {
			this.focusListeners.set(id, listener);
		}
		return listener;
	}

	/**
	 * Focuses the child element based by dataIndex that is rendered.
	 * @param dataIndexToFocus - index in data that should be focused
	 */
	protected focusChildOfDataIndex(dataIndexToFocus: number) {
		const element = this.renderData.elements.find(
			({ dataIndex }) => dataIndex === dataIndexToFocus,
		);
		if (element) {
			this.focus.focusChild(element.id, { preventScroll: true });
		}
	}

	/**
	 * Compares the current data item with the new item to determine if they are equal.
	 * @param newItem - The new item to compare with the current item.
	 * @return boolean - Returns true if the items are equal, false otherwise.
	 */
	private compareData = (newItem: T) => {
		const currentItem = this.data[this.dataIndex];
		const compare = this.c.dataComparisonFunction ?? this.equality;
		return compare(currentItem, newItem);
	};

	/**
	 * Default equality function that checks if two items are strictly equal.
	 * This can be overridden by providing a custom dataComparisonFunction in the configuration.
	 * @param a - first item to compare
	 * @param b - second item to compare
	 * @returns boolean - true if items are equal, false otherwise
	 */
	private equality(a: T, b: T) {
		return a === b;
	}
}
