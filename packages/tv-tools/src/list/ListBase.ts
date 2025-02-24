import type { FocusContainer } from '../focus';
import { clamp } from '../utils/clamp';
import { EventListener } from '../utils/EventListener';
import { Performance } from '../utils/Performance';
import type { DataChange, ListBehavior, ListSetup, RenderData } from './types';

export abstract class ListBase<
	ListConfiguration extends Record<string, unknown>,
> implements ListBehavior
{
	private events = new EventListener<{ dataIndex: number }>();

	protected renderData: RenderData;

	protected dataIndex = 0;

	constructor(
		protected focus: FocusContainer,
		protected c: ListSetup<ListConfiguration>,
	) {
		if (c.navigatableElements > c.visibleElements) {
			throw new Error(
				'visibleElements must be same or larger than navigatableElements, recommended value is 2 or 4 larger.',
			);
		}
		const elementsLength =
			c.dataLength > c.visibleElements ? c.visibleElements : c.dataLength;
		this.renderData = {
			listOffset: 0,
			elements: new Array(elementsLength).map((_, i) => ({
				id: `${c.id}-${i}`,
				dataIndex: i,
				offset: 0,
			})),
		};
		if (typeof c.initialIndex === 'number' && c.initialIndex > 0) {
			this.moveTo(c.initialIndex);
		}
	}

	public addEventListener = this.events.addEventListener;

	public removeEventListener = this.events.removeEventListener;

	public getRenderData(): RenderData {
		return this.renderData;
	}

	public updateDataLength({ start, end }: DataChange): void {
		throw new Error('Not implemented');
	}

	public moveBy(diff: number): RenderData {
		return this.moveTo(this.dataIndex + diff);
	}

	public moveTo(index: number): RenderData {
		const newIndex = clamp(0, index, this.c.dataLength - 1);
		if (newIndex !== this.dataIndex) {
			this.renderData = this.move(newIndex);
			this.events.triggerEvent('dataIndex', this.dataIndex);
		}
		return this.renderData;
	}

	protected abstract move(newIndex: number): RenderData;

	protected isAnimated() {
		return this.c.performance === Performance.ANIMATED;
	}
}

export type ListImplementation = typeof ListBase;
