import type { FocusManager } from '@salik1992/tv-tools/focus';

export type Focus = {
	addChild: (
		childId: string,
		spans?: { colSpan?: number; rowSpan?: number },
	) => void;
	focusManager: FocusManager | null;
};
