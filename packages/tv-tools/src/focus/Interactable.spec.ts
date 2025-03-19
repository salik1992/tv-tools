import { BACK, ENTER, type Key } from '../control';
import { Interactable } from './Interactable';
import { focus } from './focus';

// @ts-expect-error: mock
global.PointerEvent = class {
	constructor(
		type: string,
		init: { pointerType: 'mouse' | 'touch'; button?: number } = {
			pointerType: 'mouse',
		},
	) {
		const event = new MouseEvent(type, { button: init.button });
		// @ts-expect-error: mock
		event.pointerType = init.pointerType;
		return event;
	}
};

const keyEvent = (key: Key) => ({
	target: (() => {
		const div = document.createElement('div');
		div.id = 'interactable';
		return div;
	})(),
	code: key.toKeyboardEvent('keydown').code,
	keyCode: key.toKeyboardEvent('keydown').keyCode,
	preventDefault: jest.fn(),
	stopPropagation: jest.fn(),
});

describe('Interactable', () => {
	const onPress = jest.fn();
	const element = document.createElement('div');
	const focusSpy = jest.spyOn(element, 'focus');
	const addEventListener = jest.spyOn(element, 'addEventListener');
	const removeEventListener = jest.spyOn(element, 'removeEventListener');
	const interactable = new Interactable('interactable', 1);
	interactable.setOnPress(onPress);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('focus handling', () => {
		it('should focus itself when no element', () => {
			focus.focus('interactable');
			expect(focusSpy).not.toHaveBeenCalled();
		});

		it('should focus the element once it is referenced', () => {
			expect(focusSpy).not.toHaveBeenCalled();
			interactable.setElement(element);
			expect(element.id).toBe('interactable');
			expect(element.tabIndex).toBe(1);
			expect(addEventListener.mock.calls).toEqual([
				['pointerdown', expect.any(Function)],
				['pointermove', expect.any(Function)],
			]);
			expect(removeEventListener).not.toHaveBeenCalled();
			expect(focusSpy).toHaveBeenCalled();
		});

		it('should focus the element directly when focused with element present', () => {
			expect(focusSpy).not.toHaveBeenCalled();
			focus.focus('interactable');
			expect(focusSpy).toHaveBeenCalled();
		});

		it('should update tabIndex', () => {
			interactable.updateTabIndex(10);
			expect(element.tabIndex).toBe(10);
		});
	});

	describe('enter', () => {
		it('should call onPress when ENTER is pressed', () => {
			expect(onPress).not.toHaveBeenCalled();
			focus.handleKeyEvent('keydown', 'bubble', keyEvent(ENTER));
			expect(onPress).toHaveBeenCalled();
		});

		it('should not call onPress when something else is pressed', () => {
			expect(onPress).not.toHaveBeenCalled();
			focus.handleKeyEvent('keydown', 'bubble', keyEvent(BACK));
			expect(onPress).not.toHaveBeenCalled();
		});
	});

	describe('pointer events', () => {
		it('should call onPress on left mouse button', () => {
			const event = new PointerEvent('pointerdown', {
				pointerType: 'mouse',
				button: 0,
			});
			element.dispatchEvent(event);
			expect(onPress).toHaveBeenCalled();
		});

		it('should not call onPress for any other mouse button', () => {
			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					pointerType: 'mouse',
					button: 1,
				}),
			);
			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					pointerType: 'mouse',
					button: 2,
				}),
			);
			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					pointerType: 'mouse',
					button: 3,
				}),
			);
			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					pointerType: 'mouse',
					button: 4,
				}),
			);
			expect(onPress).not.toHaveBeenCalled();
		});

		it('should call onPress for touch', () => {
			element.dispatchEvent(
				new PointerEvent('pointerdown', { pointerType: 'touch' }),
			);
			expect(onPress).toHaveBeenCalled();
		});

		it('should focus itself on pointer move', () => {
			element.dispatchEvent(new PointerEvent('pointermove'));
			expect(focusSpy).toHaveBeenCalled();
		});
	});

	describe('cleaning', () => {
		const newElement = document.createElement('div');
		const newRemoveEventListener = jest.spyOn(
			newElement,
			'removeEventListener',
		);

		it('should clear old element when new one is passed', () => {
			interactable.setElement(newElement);
			expect(removeEventListener.mock.calls).toEqual([
				['pointerdown', expect.any(Function)],
				['pointermove', expect.any(Function)],
			]);
		});

		it('should clear listeners and focus registration on destroy', () => {
			const removeSpy = jest.spyOn(focus, 'removeFocusId');
			interactable.destroy();
			expect(removeSpy).toHaveBeenCalled();
			expect(newRemoveEventListener.mock.calls).toEqual([
				['pointerdown', expect.any(Function)],
				['pointermove', expect.any(Function)],
			]);
		});
	});
});
