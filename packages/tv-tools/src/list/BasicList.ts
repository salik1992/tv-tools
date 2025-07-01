import { ListBase } from './ListBase';
import type { RenderData } from './types';

/**
 * Parameters required to calculate the new data window
 * and the positions of elements.
 */
type MoveParams = {
	newIndex: number;
	dataOffset: number;
	listOffset: number;
	firstScroll: number;
	scroll: number;
	navigatableCount: number;
};

/**
 * The data for rendering and for calculation which element
 * should render which data.
 */
type MoveResult = {
	listOffset: number;
	dataOffset: number;
};

/**
 * Moving in the list forward (right/down).
 */
function baseForward({
	newIndex,
	dataOffset,
	firstScroll,
	navigatableCount,
}: MoveParams): MoveResult {
	const newDataOffset =
		// Are we at the edge of movement?
		newIndex - dataOffset >= navigatableCount
			? // Then we need to calculate new data offset
				dataOffset + (newIndex - navigatableCount - dataOffset + 1)
			: // Otherwise we do not move data, only change focused element
				dataOffset;
	return {
		listOffset:
			// If data offset is greater than 0 we always want to scroll
			// or when newIndex is greater than navigatable elements count.
			dataOffset > 0 || newIndex >= navigatableCount - 1
				? // Without animation we only the first scroll and then rotate data
					firstScroll
				: 0,
		dataOffset: newDataOffset,
	};
}

/**
 * Moving in the list backward (left/up).
 */
function baseBackward({
	newIndex,
	dataOffset,
	firstScroll,
	listOffset,
}: MoveParams): MoveResult {
	const newDataOffset =
		// Are we at the edge of movement?
		newIndex <= dataOffset
			? // Then we need to calculate new data offset
				dataOffset - (dataOffset - newIndex + 1)
			: // Otherwise we do not move data, only change focused element
				dataOffset;
	return {
		// We remove the scroll when we return to 1 or we keep it at 0 if
		// it is 0 (e.g. partial scroll down the list not scrolling and returning)
		listOffset: newIndex === 0 || listOffset === 0 ? 0 : firstScroll,
		dataOffset: Math.max(newDataOffset, 0),
	};
}

/**
 * Adjustment of list offset when the list is animated.
 */
function animate(baseMove: (move: MoveParams) => MoveResult) {
	return function (move: MoveParams) {
		const base = baseMove(move);
		return {
			listOffset:
				// We scroll if the base scrolls
				base.listOffset > 0
					? // And the scroll is always first and by amount of data offset
						move.firstScroll + base.dataOffset * move.scroll
					: 0,
			dataOffset: base.dataOffset,
		};
	};
}

const animateForward = animate(baseForward);
const animateBackward = animate(baseBackward);

export class BasicList<T> extends ListBase<
	T,
	{
		/**
		 * The number of elements which are focusable. The rule of thumb is usually
		 * navigatableElements + 2 === visibleElements
		 */
		navigatableElements: number;
		scrolling: {
			/**
			 * The number of pixels by which to scroll from the 0.
			 */
			first: number;
			/**
			 * The number of pixels bu which to scroll in all other scroll movements.
			 */
			other: number;
		};
	}
> {
	/**
	 * Calculates the new render data for the new data index.
	 */
	protected override move(newIndex: number): RenderData<T> {
		// Get the function that should do the calculation
		const moveFunction = this.getMoveFunction(newIndex);
		// Calculate data offset and list scroll
		const moveResult = moveFunction({
			newIndex: newIndex,
			dataOffset: Math.min(
				...this.renderData.elements.map(({ dataIndex }) => dataIndex),
			),
			listOffset: this.renderData.baseOffset,
			firstScroll: this.c.config.scrolling.first,
			scroll: this.c.config.scrolling.other,
			navigatableCount: this.c.config.navigatableElements,
		});
		const isAnimated = this.isAnimated();
		const { length } = this.renderData.elements;
		// Base page is the smallest page of data, the page means rotating
		// the elements to the next data.
		const basePage = Math.floor(moveResult.dataOffset / length);
		// How many elements at the start will be one page higher then
		// the rest
		const newPageUpTo = (moveResult.dataOffset % length) - 1;
		return {
			elements: this.renderData.elements.map((element, i) => {
				// Page for the element for animated
				const page = newPageUpTo >= i ? basePage + 1 : basePage;
				// DataIndex for basic behavior
				const dataIndex = isAnimated
					? page * length + i
					: i + moveResult.dataOffset;
				return {
					id: element.id,
					item: this.data[dataIndex],
					dataIndex,
					offset: isAnimated
						? page *
							(this.c.visibleElements *
								this.c.config.scrolling.other)
						: 0,
					onFocus: this.getOnFocusForElement(element.id),
				};
			}),
			baseOffset: moveResult.listOffset,
			previousArrow: newIndex > 0,
			nextArrow: newIndex < this.data.length - 1,
		};
	}

	/**
	 * Returns a function to use for calculation based on the list configuration
	 * and the direction of movement.
	 */
	protected getMoveFunction(index: number) {
		if (this.isAnimated()) {
			return index > this.dataIndex ? animateForward : animateBackward;
		}
		return index > this.dataIndex ? baseForward : baseBackward;
	}
}
