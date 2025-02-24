import { BLUE, GREEN, RED, YELLOW, type Key } from '../control';
import { focus } from './focus';
import type { ControlEvent } from './types';

const mockEvent = (targetId: string): ControlEvent => ({
	target: (() => {
		const el = document.createElement('div');
		el.id = targetId;
		return el;
	})(),
	preventDefault: jest.fn(),
	stopPropagation: jest.fn(),
});

describe('focus', () => {
	describe('single focus id handling', () => {
		const onFocus = jest.fn();

		beforeEach(() => {
			onFocus.mockClear();
		});

		it('should add a focus id', () => {
			expect(() => focus.addFocusId('test', onFocus)).not.toThrow();
		});

		it('should throw when trying to add it again', () => {
			expect(() => focus.addFocusId('test', onFocus)).toThrow();
		});

		it('should call its focus listener when being focused', () => {
			focus.focus('test');
			focus.focus('test', { preventScroll: true });
			expect(onFocus).toHaveBeenNthCalledWith(1, undefined);
			expect(onFocus).toHaveBeenNthCalledWith(2, { preventScroll: true });
		});

		it('should remove focus id', () => {
			expect(() => focus.removeFocusId('test')).not.toThrow();
		});

		it('should not be able to focus id that does not exist', () => {
			expect(() => focus.focus('test')).toThrow();
		});
	});

	describe('event listeners', () => {
		const onKeyDown = jest.fn();
		const onKeyUpCapture = jest.fn();
		const onKeyPress = jest.fn();

		beforeAll(() => {
			focus.addFocusId('test', jest.fn());
		});

		beforeEach(() => {
			onKeyDown.mockClear();
			onKeyUpCapture.mockClear();
			onKeyPress.mockClear();
		});

		it('should add event listeners', () => {
			expect(() =>
				focus.addEventListener('test', onKeyDown, 'keydown', 'bubble'),
			).not.toThrow();
			expect(() =>
				focus.addEventListener(
					'test',
					onKeyUpCapture,
					'keyup',
					'capture',
				),
			).not.toThrow();
		});

		it('should call only the onKeyDown bubble listener', () => {
			focus.handleKeyEvent('keydown', 'bubble', mockEvent('test'));
			expect(onKeyDown).toHaveBeenCalled();
			expect(onKeyUpCapture).not.toHaveBeenCalled();
			expect(onKeyPress).not.toHaveBeenCalled();
		});

		it('should call only the onKeyDown capture listener', () => {
			focus.handleKeyEvent('keydown', 'capture', mockEvent('test'));
			expect(onKeyDown).not.toHaveBeenCalled();
			expect(onKeyUpCapture).not.toHaveBeenCalled();
			expect(onKeyPress).not.toHaveBeenCalled();
		});

		it('should call only the onKeyUp capture listener', () => {
			focus.handleKeyEvent('keyup', 'capture', mockEvent('test'));
			expect(onKeyDown).not.toHaveBeenCalled();
			expect(onKeyUpCapture).toHaveBeenCalled();
			expect(onKeyPress).not.toHaveBeenCalled();
		});

		it('should remove listeners when removing the focus element', () => {
			focus.removeFocusId('test');
			focus.handleKeyEvent('keyup', 'capture', mockEvent('test'));
			expect(onKeyDown).not.toHaveBeenCalled();
			expect(onKeyUpCapture).not.toHaveBeenCalled();
			expect(onKeyPress).not.toHaveBeenCalled();
		});
	});

	describe('event progression through tree', () => {
		const callstack: string[] = [];
		let parentBubbleResult = false;
		let parentCaptureResult = false;
		let childBubbleResult = false;
		let childCaptureResult = false;
		const parentBubble = () => {
			callstack.push('parentBubble');
			return parentBubbleResult;
		};
		const parentCapture = () => {
			callstack.push('parentCapture');
			return parentCaptureResult;
		};
		const childBubble = () => {
			callstack.push('childBubble');
			return childBubbleResult;
		};
		const childCapture = () => {
			callstack.push('childCapture');
			return childCaptureResult;
		};
		const otherBubble = () => {
			callstack.push('otherBubble');
			return false;
		};
		const otherCapture = () => {
			callstack.push('otherCapture');
			return false;
		};

		beforeAll(() => {
			focus.addFocusId('parent', jest.fn());
			focus.addFocusId('child', jest.fn());
			focus.addFocusId('other', jest.fn());
			focus.addParentChild('parent', 'child');
			focus.addEventListener('parent', parentBubble, 'keydown', 'bubble');
			focus.addEventListener(
				'parent',
				parentCapture,
				'keydown',
				'capture',
			);
			focus.addEventListener('child', childBubble, 'keydown', 'bubble');
			focus.addEventListener('child', childCapture, 'keydown', 'capture');
			focus.addEventListener('other', otherBubble, 'keydown', 'bubble');
			focus.addEventListener('other', otherCapture, 'keydown', 'capture');
		});

		beforeEach(() => {
			parentBubbleResult = false;
			parentCaptureResult = false;
			childBubbleResult = false;
			childCaptureResult = false;
			callstack.length = 0;
		});

		afterAll(() => {
			focus.removeFocusId('other');
			focus.removeFocusId('child');
			focus.removeFocusId('parent');
		});

		it('should bubble from child to parent', () => {
			const event = mockEvent('child');
			focus.handleKeyEvent('keydown', 'bubble', event);
			expect(callstack).toEqual(['childBubble', 'parentBubble']);
			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(event.stopPropagation).not.toHaveBeenCalled();
		});

		it('should capture from parent to child', () => {
			const event = mockEvent('child');
			focus.handleKeyEvent('keydown', 'capture', event);
			expect(callstack).toEqual(['parentCapture', 'childCapture']);
			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(event.stopPropagation).not.toHaveBeenCalled();
		});

		it('should stop bubble if the event is handled', () => {
			const event = mockEvent('child');
			childBubbleResult = true;
			focus.handleKeyEvent('keydown', 'bubble', event);
			expect(callstack).toEqual(['childBubble']);
			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
		});

		it('should stop capture if the event is handled', () => {
			const event = mockEvent('child');
			parentCaptureResult = true;
			focus.handleKeyEvent('keydown', 'capture', event);
			expect(callstack).toEqual(['parentCapture']);
			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
		});
	});

	describe('key sequences', () => {
		const keyPress = (key: Key) => {
			focus.handleKeyEvent(
				'keydown',
				'capture',
				key.toKeyboardEvent('keydown') as unknown as ControlEvent,
			);
			focus.handleKeyEvent(
				'keydown',
				'bubble',
				key.toKeyboardEvent('keydown') as unknown as ControlEvent,
			);
			focus.handleKeyEvent(
				'keyup',
				'capture',
				key.toKeyboardEvent('keyup') as unknown as ControlEvent,
			);
			focus.handleKeyEvent(
				'keyup',
				'bubble',
				key.toKeyboardEvent('keyup') as unknown as ControlEvent,
			);
		};

		it('should call a key sequence when the sequence is reached', () => {
			const sequence = [RED, YELLOW, GREEN, BLUE, YELLOW];
			const listener = jest.fn();
			focus.addKeySequenceListener(sequence, listener);
			keyPress(RED);
			expect(listener).not.toHaveBeenCalled();
			keyPress(YELLOW);
			expect(listener).not.toHaveBeenCalled();
			keyPress(GREEN);
			expect(listener).not.toHaveBeenCalled();
			keyPress(BLUE);
			expect(listener).not.toHaveBeenCalled();
			keyPress(YELLOW);
			expect(listener).toHaveBeenCalled();
			listener.mockClear();
			focus.removeKeySequenceListener(sequence);
			keyPress(RED);
			keyPress(YELLOW);
			keyPress(GREEN);
			keyPress(BLUE);
			keyPress(YELLOW);
			expect(listener).not.toHaveBeenCalled();
		});
	});
});
