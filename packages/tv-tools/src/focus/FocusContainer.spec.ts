import { focus } from './focus';
import { FocusContainer, RenderProgress } from './FocusContainer';

describe('FocusContainer', () => {
	const container = new FocusContainer('container');
	const children = [
		{ id: '0', onFocus: jest.fn() },
		{ id: '1', onFocus: jest.fn() },
		{ id: '2', onFocus: jest.fn() },
		{ id: '3', onFocus: jest.fn() },
		{ id: '4', onFocus: jest.fn() },
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should focus itself if no children', () => {
		expect(focus.focusTrappedInContainer).toBeUndefined();
		focus.focus('container');
		expect(typeof focus.focusTrappedInContainer).toBe('string');
	});

	it('should focus first child when children are added', () => {
		container.setRenderProgress(RenderProgress.STARTED);
		for (const child of children) {
			focus.addFocusId(child.id, child.onFocus);
			container.addChild(child.id);
		}
		expect(typeof focus.focusTrappedInContainer).toBe('string');
		expect(children[0].onFocus).not.toHaveBeenCalled();
		container.setRenderProgress(RenderProgress.FINISHED);
		expect(focus.focusTrappedInContainer).toBeUndefined();
		expect(children[0].onFocus).toHaveBeenCalled();
	});

	it('should move the focus by diff', () => {
		expect(children[2].onFocus).not.toHaveBeenCalled();
		container.moveFocus(2, children[0].id);
		expect(children[2].onFocus).toHaveBeenCalled();
	});

	it('should clamp the focus on the start', () => {
		expect(children[0].onFocus).not.toHaveBeenCalled();
		container.moveFocus(-Infinity, '2');
		expect(children[0].onFocus).toHaveBeenCalled();
	});

	it('should clamp the focus on the end', () => {
		expect(children[4].onFocus).not.toHaveBeenCalled();
		container.moveFocus(Infinity, '2');
		expect(children[4].onFocus).toHaveBeenCalled();
	});

	it('should focus last focused child when container is focused', () => {
		expect(children[4].onFocus).not.toHaveBeenCalled();
		focus.focus('container');
		expect(children[4].onFocus).toHaveBeenCalled();
	});
});
