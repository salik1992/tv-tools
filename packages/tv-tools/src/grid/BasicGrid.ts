import { GridBase } from './GridBase';
import type { RenderData } from './types';

/**
 * Parameters required to calculate the new data window
 * and the positions of elements.
 */
type MoveParams = {
	newIndex: number;
	dataOffset: number;
	gridOffset: number;
	firstScroll: number;
	scroll: number;
	navigatableCount: number;
	groupSize: number;
};

/**
 * The data for rendering and for calculation which element
 * should render which data.
 */
type MoveResult = {
	gridOffset: number;
	dataOffset: number;
};

/**
 * Moving in the grid forward (right/down).
 */
function baseForward({
	newIndex,
	dataOffset,
	firstScroll,
	navigatableCount,
	groupSize,
}: MoveParams): MoveResult {
	const navigatableElementsCount = navigatableCount * groupSize;
	const newDataOffset =
		// Are we at the edge of movement?
		newIndex - dataOffset >= navigatableElementsCount
			? // Then we need to calculate new data offset
				dataOffset +
				Math.ceil(
					(newIndex - navigatableElementsCount - dataOffset + 1) /
						groupSize,
				) *
					groupSize
			: // Otherwise we do not move data, only change focused element
				dataOffset;
	return {
		gridOffset:
			// If data offset is greater than 0 we always want to scroll
			// or when newIndex is greater than navigatable elements count.
			dataOffset > 0 || newIndex >= navigatableElementsCount - groupSize
				? // Without animation we only the first scroll and then rotate data
					firstScroll
				: 0,
		dataOffset: newDataOffset,
	};
}

/**
 * Moving in the grid backward (left/up).
 */
function baseBackward({
	newIndex,
	dataOffset,
	firstScroll,
	gridOffset,
	groupSize,
}: MoveParams): MoveResult {
	const newDataOffset =
		// Are we at the edge of movement?
		newIndex - groupSize < dataOffset
			? // Then we need to calculate new data offset
				dataOffset -
				Math.ceil((dataOffset - newIndex + groupSize) / groupSize) *
					groupSize
			: // Otherwise we do not move data, only change focused element
				dataOffset;
	return {
		// We remove the scroll when we return to 1 or we keep it at 0 if
		// it is 0 (e.g. partial scroll down the grid not scrolling and returning)
		gridOffset: newIndex < groupSize || gridOffset === 0 ? 0 : firstScroll,
		dataOffset: Math.max(newDataOffset, 0),
	};
}

/**
 * Adjustment of grid offset when the grid is animated.
 */
function animate(baseMove: (move: MoveParams) => MoveResult) {
	return function (move: MoveParams) {
		const base = baseMove(move);
		return {
			gridOffset:
				// We scroll if the base scrolls
				base.gridOffset > 0
					? // And the scroll is always first and by amount of data offset
						move.firstScroll +
						Math.floor(base.dataOffset / move.groupSize) *
							move.scroll
					: 0,
			dataOffset: base.dataOffset,
		};
	};
}

const animateForward = animate(baseForward);
const animateBackward = animate(baseBackward);

export class BasicGrid extends GridBase<{
	/**
	 * The number of elements which are focusable. The rule of thumb is usually
	 * navigatableElements + 2 === visibleElements
	 */
	navigatableGroups: number;
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
}> {
	/**
	 * Calculates the new render data for the new data index.
	 */
	public override move(newIndex: number): RenderData {
		// Get the function that should do the calculation
		const moveFunction = this.getMoveFunction(newIndex);
		// Calculate data offset and grid scroll
		const moveResult = moveFunction({
			newIndex: newIndex,
			dataOffset: Math.min(
				...this.getAllElements().map(({ dataIndex }) => dataIndex),
			),
			gridOffset: this.renderData.gridOffset,
			firstScroll: this.c.config.scrolling.first,
			scroll: this.c.config.scrolling.other,
			navigatableCount: this.c.config.navigatableGroups,
			groupSize: this.c.elementsPerGroup,
		});
		const isAnimated = this.isAnimated();
		const { length } = this.getAllElements();
		// Base page is the smallest page of data, the page means rotating
		// the elements to the next data.
		const basePage = Math.floor(moveResult.dataOffset / length);
		// How many elements at the start will be one page higher then
		// the rest
		const newPageUpTo = (moveResult.dataOffset % length) - 1;
		return {
			groups: this.renderData.groups.map((group, i) => {
				// DataIndex for basic behavior
				// Page for the element for animated
				const page =
					newPageUpTo >= i * this.c.elementsPerGroup
						? basePage + 1
						: basePage;
				return {
					id: group.id,
					elements: group.elements.map((element, j) => {
						const elementDataOffset =
							i * this.c.elementsPerGroup + j;
						const dataIndex =
							elementDataOffset + moveResult.dataOffset;
						return {
							id: element.id,
							dataIndex: isAnimated
								? page * length + elementDataOffset
								: dataIndex,
							onFocus: this.getOnFocusForElement(element.id),
						};
					}),
					offset: isAnimated
						? page *
							(this.c.visibleGroups *
								this.c.config.scrolling.other)
						: 0,
				};
			}),
			gridOffset: moveResult.gridOffset,
			previousArrow: newIndex > 0,
			nextArrow: newIndex < this.c.dataLength - 1,
		};
	}

	/**
	 * Returns a function to use for calculation based on the grid configuration
	 * and the direction of movement.
	 */
	private getMoveFunction(index: number) {
		if (this.isAnimated()) {
			return index > this.dataIndex ? animateForward : animateBackward;
		}
		return index > this.dataIndex ? baseForward : baseBackward;
	}
}
