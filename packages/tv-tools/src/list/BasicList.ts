import { ListBase } from './ListBase';
import type { RenderData } from './types';

type MoveParams = {
	newIndex: number;
	dataOffset: number;
	firstScroll: number;
	scroll: number;
	navigatableCount: number;
};

type MoveResult = {
	listOffset: number;
	focusIndex: number;
	dataOffset: number;
};

function baseForward({
	newIndex,
	dataOffset,
	firstScroll,
	navigatableCount,
}: MoveParams): MoveResult {
	const newDataOffset =
		newIndex - dataOffset >= navigatableCount
			? dataOffset + (newIndex - dataOffset + 1)
			: dataOffset;
	return {
		listOffset:
			dataOffset > 0 || newIndex === navigatableCount ? firstScroll : 0,
		focusIndex: newIndex - dataOffset,
		dataOffset: newDataOffset,
	};
}

function baseBackward({
	newIndex,
	dataOffset,
	firstScroll,
}: MoveParams): MoveResult {
	const newDataOffset =
		newIndex <= dataOffset
			? dataOffset - (dataOffset - newIndex + 1)
			: dataOffset;
	return {
		listOffset: newIndex === 0 ? 0 : firstScroll,
		focusIndex: newIndex - newDataOffset,
		dataOffset: newDataOffset,
	};
}

function animateForward({}: MoveParams): MoveResult {}
function animateBackward({}: MoveParams): MoveResult {}

export class BasicList extends ListBase<{
	scrolling: {
		first: number;
		other: number;
	};
}> {
	public override move(newIndex: number): RenderData {
		const moveFunction = this.getMoveFunction(newIndex);
		const moveResult = moveFunction({
			newIndex: newIndex,
			dataOffset: Math.min(
				...this.renderData.elements.map(({ dataIndex }) => dataIndex),
			),
			firstScroll: this.c.config.scrolling.first,
			scroll: this.c.config.scrolling.other,
			navigatableCount: this.c.navigatableElements,
		});
		return {
			elements: this.renderData.elements.map((element, i) => ({
				id: element.id,
				dataIndex: i + moveResult.dataOffset,
				offset: 0,
			})),
			listOffset: moveResult.listOffset,
		};
	}

	private getMoveFunction(index: number) {
		if (this.isAnimated()) {
			return index > this.dataIndex ? animateForward : animateBackward;
		}
		return index > this.dataIndex ? baseForward : baseBackward;
	}
}
