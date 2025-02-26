import { FocusContainer } from '../focus';
import type { IEventListener } from '../utils/EventListener';
import type { Performance } from '../utils/Performance';

export interface RenderDataElement {
	id: string;
	dataIndex: number;
	offset: number;
}

export interface RenderData {
	elements: RenderDataElement[];
	listOffset: number;
}

export type DataChange = { start?: number; end?: number };

export interface ListBehavior extends IEventListener<{ dataIndex: number }> {
	getRenderData(): RenderData;
	moveTo(index: number): RenderData;
	moveBy(diff: number, fromId?: string): RenderData;
	updateDataLength(change: DataChange): void;
}

export interface ListSetup<ListConfiguration extends Record<string, unknown>> {
	id: string;
	performance: Performance;
	dataLength: number;
	visibleElements: number;
	navigatableElements: number;
	initialIndex?: number;
	config: ListConfiguration;
}

export interface ListImplementation<
	Configuration extends ListSetup<{}> = ListSetup<{}>,
> {
	new (focus: FocusContainer, configuration: Configuration): ListBehavior;
}
