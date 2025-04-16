export type Focus = {
	addChild: (
		childId: string,
		spans?: { colSpan?: number; rowSpan?: number },
	) => void;
};
