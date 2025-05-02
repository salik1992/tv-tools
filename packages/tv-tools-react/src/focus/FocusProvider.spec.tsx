import { createRef } from 'react';
import { render } from '@testing-library/react';
import type { FocusManager } from '@salik1992/tv-tools/focus';
import { FocusProvider } from './FocusProvider';
import { ExposeFocusManager, assertFocusManager } from './mocks';

const NAVIGATIONAL_CODE = 'ArrowDown';
const OTHER_CODE = 'Enter';

describe('FocusProvider', () => {
	const focusManager = createRef<FocusManager>();

	it('should render the children', () => {
		const { container } = render(
			<FocusProvider>
				<div>Test</div>
				<ExposeFocusManager focusManager={focusManager} />
			</FocusProvider>,
		);
		expect(container.innerHTML).toMatchSnapshot();
	});

	it('should pass keyboard events to the focus manager', () => {
		const { container } = render(
			<FocusProvider id="focusRoot">
				<div>Test</div>
				<ExposeFocusManager focusManager={focusManager} />
			</FocusProvider>,
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
		assertFocusManager(focusManager);
		const spy = jest.spyOn(focusManager.current, 'handleKeyEvent');
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
		const { container } = render(
			<FocusProvider id="focusRoot" alwaysPreventNavigationalEvents>
				<div>Test</div>
				<ExposeFocusManager focusManager={focusManager} />
			</FocusProvider>,
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
		assertFocusManager(focusManager);
		const spy = jest.spyOn(focusManager.current, 'handleKeyEvent');
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
		const { container } = render(
			<FocusProvider id="focusRoot" alwaysPreventNavigationalEvents>
				<div>Test</div>
				<ExposeFocusManager focusManager={focusManager} />
			</FocusProvider>,
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
		assertFocusManager(focusManager);
		const spy = jest.spyOn(focusManager.current, 'handleKeyEvent');
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
