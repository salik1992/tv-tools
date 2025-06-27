import { DataContainer } from '../data-container';
import type { GridBehavior, GridSetup, RenderData } from './types';

/**
 * The base for all GridBehavior implementations.
 */
export abstract class GridBase<
		T,
		GridConfiguration extends Record<string, unknown>,
	>
	extends DataContainer<
		T,
		RenderData<T>,
		GridConfiguration,
		GridSetup<T, GridConfiguration>
	>
	implements GridBehavior<T>
{
	protected override initializeRenderData(): RenderData<T> {
		return {
			baseOffset: 0,
			previousArrow: false,
			nextArrow: this.data.length > 0,
			groups: (() => {
				const groups = [];
				for (let i = 0; i < this.c.visibleGroups; i++) {
					const groupId = `${this.c.id}-g${i}`;
					groups.push({
						id: groupId,
						offset: 0,
						elements: (() => {
							const elements = [];
							for (let j = 0; j < this.c.elementsPerGroup; j++) {
								const id = `${groupId}-e${j}`;
								const dataIndex =
									i * this.c.elementsPerGroup + j;
								elements.push({
									id,
									dataIndex,
									item: this.data[dataIndex],
									offset: 0,
									onFocus: this.getOnFocusForElement(id),
								});
							}
							return elements;
						})(),
					});
				}
				return groups;
			})(),
		};
	}

	/**
	 * Get all elements that are rendered.
	 * @returns all elements that are rendered
	 */
	protected override getAllElements() {
		return this.renderData.groups.flatMap((group) => group.elements);
	}
}
