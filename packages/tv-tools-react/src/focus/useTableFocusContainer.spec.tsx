import { renderHook } from '@testing-library/react';
import {
	BACK,
	DOWN,
	ENTER,
	type Key,
	LEFT,
	RIGHT,
	UP,
} from '@salik1992/tv-tools/control';
import {
	type ControlEvent,
	TableFocusContainer,
	focus,
} from '@salik1992/tv-tools/focus';
import { useTableFocusContainer } from './useTableFocusContainer';

const ID = 'test';

const press = (key: Key) => {
	const event = key.toKeyboardEvent('keydown');
	const target = document.createElement('div');
	target.id = ID;
	focus.handleKeyEvent('keydown', 'bubble', {
		code: event.code,
		target,
		preventDefault: () => event.preventDefault(),
		stopPropagation: () => event.stopPropagation(),
	} as unknown as ControlEvent);
};

describe('useTableFocusContainer', () => {
	it('should return TableFocusContainer, keybinding hooks and value for FocusContext', () => {
		const { result } = renderHook(() => useTableFocusContainer());
		expect(result.current).toEqual({
			container: expect.any(TableFocusContainer),
			focusContextValue: {
				addChild: expect.any(Function),
			},
			useOnKeyDown: expect.any(Function),
			useOnEnter: expect.any(Function),
			useOnBack: expect.any(Function),
			useOnUp: expect.any(Function),
			useOnDown: expect.any(Function),
			useOnLeft: expect.any(Function),
			useOnRight: expect.any(Function),
		});
	});

	it('should call useOnKeyDown for any key press', () => {
		const onKeyDown = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnKeyDown(onKeyDown, []),
		);
		press(ENTER);
		expect(onKeyDown).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'Enter' }),
		);
		press(LEFT);
		expect(onKeyDown).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowLeft' }),
		);
		press(BACK);
		expect(onKeyDown).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'Escape' }),
		);
		onKeyDown.mockClear();
		unmount();
		press(ENTER);
		expect(onKeyDown).not.toHaveBeenCalled();
	});

	it('should call useOnEnter for ENTER key press', () => {
		const onEnter = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnEnter(onEnter, []),
		);
		press(ENTER);
		expect(onEnter).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'Enter' }),
		);
		onEnter.mockClear();
		press(BACK);
		expect(onEnter).not.toHaveBeenCalled();
		press(LEFT);
		expect(onEnter).not.toHaveBeenCalled();
		unmount();
		press(ENTER);
		expect(onEnter).not.toHaveBeenCalled();
	});

	it('should call useOnBack for BACK key press', () => {
		const onBack = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnBack(onBack, []),
		);
		press(BACK);
		expect(onBack).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'Escape' }),
		);
		onBack.mockClear();
		press(ENTER);
		expect(onBack).not.toHaveBeenCalled();
		press(LEFT);
		expect(onBack).not.toHaveBeenCalled();
		unmount();
		press(BACK);
		expect(onBack).not.toHaveBeenCalled();
	});

	it('should call useOnUp for UP key press', () => {
		const onUp = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() => result.current.useOnUp(onUp, []));
		press(UP);
		expect(onUp).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowUp' }),
		);
		onUp.mockClear();
		press(ENTER);
		expect(onUp).not.toHaveBeenCalled();
		press(BACK);
		expect(onUp).not.toHaveBeenCalled();
		unmount();
		press(UP);
		expect(onUp).not.toHaveBeenCalled();
	});

	it('should call useOnDown for DOWN key press', () => {
		const onDown = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnDown(onDown, []),
		);
		press(DOWN);
		expect(onDown).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowDown' }),
		);
		onDown.mockClear();
		press(ENTER);
		expect(onDown).not.toHaveBeenCalled();
		press(BACK);
		expect(onDown).not.toHaveBeenCalled();
		unmount();
		press(DOWN);
		expect(onDown).not.toHaveBeenCalled();
	});

	it('should call useOnLeft for LEFT key press', () => {
		const onLeft = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnLeft(onLeft, []),
		);
		press(LEFT);
		expect(onLeft).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowLeft' }),
		);
		onLeft.mockClear();
		press(ENTER);
		expect(onLeft).not.toHaveBeenCalled();
		press(BACK);
		expect(onLeft).not.toHaveBeenCalled();
		unmount();
		press(LEFT);
		expect(onLeft).not.toHaveBeenCalled();
	});

	it('should call useOnRight for RIGHT key press', () => {
		const onRight = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnRight(onRight, []),
		);
		press(RIGHT);
		expect(onRight).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowRight' }),
		);
		onRight.mockClear();
		press(ENTER);
		expect(onRight).not.toHaveBeenCalled();
		press(BACK);
		expect(onRight).not.toHaveBeenCalled();
		unmount();
		press(RIGHT);
		expect(onRight).not.toHaveBeenCalled();
	});

	it('should call useOnLeft for RIGHT key press during rtl', () => {
		document.documentElement.dir = 'rtl';
		const onLeft = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnLeft(onLeft, []),
		);
		press(RIGHT);
		expect(onLeft).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowRight' }),
		);
		onLeft.mockClear();
		press(LEFT);
		expect(onLeft).not.toHaveBeenCalled();
		unmount();
		press(RIGHT);
		expect(onLeft).not.toHaveBeenCalled();
		document.documentElement.dir = '';
	});

	it('should call useOnRight for LEFT key press during rtl', () => {
		document.documentElement.dir = 'rtl';
		const onRight = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnRight(onRight, []),
		);
		press(LEFT);
		expect(onRight).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowLeft' }),
		);
		onRight.mockClear();
		press(RIGHT);
		expect(onRight).not.toHaveBeenCalled();
		unmount();
		press(LEFT);
		expect(onRight).not.toHaveBeenCalled();
		document.documentElement.dir = '';
	});

	it('should call useOnLeft for LEFT key press during rtl with ignoreRtl', () => {
		document.documentElement.dir = 'rtl';
		const onLeft = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnLeft(onLeft, [], { ignoreRtl: true }),
		);
		press(LEFT);
		expect(onLeft).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowLeft' }),
		);
		onLeft.mockClear();
		press(RIGHT);
		expect(onLeft).not.toHaveBeenCalled();
		unmount();
		press(LEFT);
		expect(onLeft).not.toHaveBeenCalled();
		document.documentElement.dir = '';
	});

	it('should call useOnRight for RIGHT key press during rtl with ignoreRtl', () => {
		document.documentElement.dir = 'rtl';
		const onRight = jest.fn();
		const { result } = renderHook(() => useTableFocusContainer(ID));
		const { unmount } = renderHook(() =>
			result.current.useOnRight(onRight, [], { ignoreRtl: true }),
		);
		press(RIGHT);
		expect(onRight).toHaveBeenCalledWith(
			expect.objectContaining({ code: 'ArrowRight' }),
		);
		onRight.mockClear();
		press(LEFT);
		expect(onRight).not.toHaveBeenCalled();
		unmount();
		press(RIGHT);
		expect(onRight).not.toHaveBeenCalled();
		document.documentElement.dir = '';
	});
});
