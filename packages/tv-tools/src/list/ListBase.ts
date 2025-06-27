import { DataContainer } from '../data-container';
import type { ListBehavior, ListSetup, RenderData } from './types';

/**
 * The base for all ListBehavior implementations.
 */
export abstract class ListBase<
		T,
		ListConfiguration extends Record<string, unknown>,
	>
	extends DataContainer<
		T,
		RenderData<T>,
		ListConfiguration,
		ListSetup<T, ListConfiguration>
	>
	implements ListBehavior<T>
{
	protected override initializeRenderData(): RenderData<T> {
		return {
			baseOffset: 0,
			previousArrow: false,
			nextArrow: this.data.length > 0,
			elements: (() => {
				const array = [];
				for (let i = 0; i < this.c.visibleElements; i++) {
					const id = `${this.c.id}-${i}`;
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
	}

	protected override getAllElements() {
		return this.renderData.elements;
	}
}
