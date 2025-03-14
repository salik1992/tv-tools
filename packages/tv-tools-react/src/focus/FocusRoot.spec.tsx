import { render } from '@testing-library/react';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';

const NAVIGATIONAL_CODE = 'ArrowDown';
const OTHER_CODE = 'Enter';

describe('FocusRoot', () => {
	const spy = jest.spyOn(focus, 'handleKeyEvent');

	beforeEach(() => {
		spy.mockClear();
	});

	it('should render the children', () => {
		const { container } = render(
			<FocusRoot>
				<div>Test</div>
			</FocusRoot>,
		);
		expect(container.innerHTML).toMatchSnapshot();
	});

	it('should pass keyboard events to the focus manager', () => {
		const { container } = render(
			<FocusRoot>
				<div>Test</div>
			</FocusRoot>,
		);
		const keydDownBubble = new KeyboardEvent('keydown', {
			code: 'ArrowDown',
			bubbles: true,
		});
		const stopSpyDB = jest.spyOn(keydDownBubble, 'stopPropagation');
		const keyUpBubble = new KeyboardEvent('keyup', {
			code: 'ArrowDown',
			bubbles: true,
		});
		const stopSpyUB = jest.spyOn(keyUpBubble, 'stopPropagation');
		const root = container.querySelector('#focusRoot');
		root?.dispatchEvent(keydDownBubble);
		root?.dispatchEvent(keyUpBubble);
		expect(spy).toHaveBeenNthCalledWith(
			1,
			'keydown',
			'capture',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			2,
			'keydown',
			'bubble',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			3,
			'keyup',
			'capture',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			4,
			'keyup',
			'bubble',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(stopSpyDB).not.toHaveBeenCalled();
		expect(stopSpyUB).not.toHaveBeenCalled();
	});

	it('should prevent default and stop propagation for navigational events with alwaysPreventNavigationalEvents', () => {
		const spy = jest.spyOn(focus, 'handleKeyEvent');
		const { container } = render(
			<FocusRoot alwaysPreventNavigationalEvents>
				<div>Test</div>
			</FocusRoot>,
		);
		const keydDownBubble = new KeyboardEvent('keydown', {
			code: 'ArrowDown',
			bubbles: true,
		});
		const preventSpyDB = jest.spyOn(keydDownBubble, 'preventDefault');
		const stopSpyDB = jest.spyOn(keydDownBubble, 'stopPropagation');
		const keyUpBubble = new KeyboardEvent('keyup', {
			code: 'ArrowDown',
			bubbles: true,
		});
		const preventSpyUB = jest.spyOn(keyUpBubble, 'preventDefault');
		const stopSpyUB = jest.spyOn(keyUpBubble, 'stopPropagation');
		const root = container.querySelector('#focusRoot');
		root?.dispatchEvent(keydDownBubble);
		root?.dispatchEvent(keyUpBubble);
		expect(spy).toHaveBeenNthCalledWith(
			1,
			'keydown',
			'capture',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			2,
			'keydown',
			'bubble',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			3,
			'keyup',
			'capture',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			4,
			'keyup',
			'bubble',
			expect.objectContaining({ code: NAVIGATIONAL_CODE }),
		);
		expect(preventSpyDB).toHaveBeenCalled();
		expect(stopSpyDB).toHaveBeenCalled();
		expect(preventSpyUB).toHaveBeenCalled();
		expect(stopSpyUB).toHaveBeenCalled();
	});

	it('should not prevent default and stop propagation for non-navigational events with alwaysPreventNavigationalEvents', () => {
		const spy = jest.spyOn(focus, 'handleKeyEvent');
		const { container } = render(
			<FocusRoot alwaysPreventNavigationalEvents>
				<div>Test</div>
			</FocusRoot>,
		);
		const keydDownBubble = new KeyboardEvent('keydown', {
			code: OTHER_CODE,
			bubbles: true,
		});
		const preventSpyDB = jest.spyOn(keydDownBubble, 'preventDefault');
		const stopSpyDB = jest.spyOn(keydDownBubble, 'stopPropagation');
		const keyUpBubble = new KeyboardEvent('keyup', {
			code: OTHER_CODE,
			bubbles: true,
		});
		const preventSpyUB = jest.spyOn(keyUpBubble, 'preventDefault');
		const stopSpyUB = jest.spyOn(keyUpBubble, 'stopPropagation');
		const root = container.querySelector('#focusRoot');
		root?.dispatchEvent(keydDownBubble);
		root?.dispatchEvent(keyUpBubble);
		expect(spy).toHaveBeenNthCalledWith(
			1,
			'keydown',
			'capture',
			expect.objectContaining({ code: OTHER_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			2,
			'keydown',
			'bubble',
			expect.objectContaining({ code: OTHER_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			3,
			'keyup',
			'capture',
			expect.objectContaining({ code: OTHER_CODE }),
		);
		expect(spy).toHaveBeenNthCalledWith(
			4,
			'keyup',
			'bubble',
			expect.objectContaining({ code: OTHER_CODE }),
		);
		expect(preventSpyDB).not.toHaveBeenCalled();
		expect(stopSpyDB).not.toHaveBeenCalled();
		expect(preventSpyUB).not.toHaveBeenCalled();
		expect(stopSpyUB).not.toHaveBeenCalled();
	});
});
