import { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { DOWN, LEFT, RIGHT, UP } from '@salik1992/tv-tools/control';
import { BlockNavigation } from './BlockNavigation';
import { FocusRoot } from './FocusRoot';
import { Interactable } from './Interactable';
import { FocusContext } from './context';
import { useFocusContainer } from './useFocusContainer';

const Container = ({
	onLeft,
	onRight,
	onUp,
	onDown,
	children,
}: PropsWithChildren<{
	onLeft: () => boolean;
	onRight: () => boolean;
	onUp: () => boolean;
	onDown: () => boolean;
}>) => {
	const { useOnLeft, useOnRight, useOnUp, useOnDown, focusContextValue } =
		useFocusContainer();

	useOnLeft(onLeft);
	useOnRight(onRight);
	useOnUp(onUp);
	useOnDown(onDown);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};

describe('BlockNavigation', () => {
	const onLeft = jest.fn();
	const onRight = jest.fn();
	const onUp = jest.fn();
	const onDown = jest.fn();
	const onPress = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should pass events from Interactable to container without BlockNavigation', () => {
		const { container } = render(
			<FocusRoot>
				<Container
					onLeft={onLeft}
					onRight={onRight}
					onUp={onUp}
					onDown={onDown}
				>
					<Interactable id="test" onPress={onPress}>
						Test
					</Interactable>
				</Container>
				,
			</FocusRoot>,
		);
		const interactable = container.querySelector('#test');
		expect(interactable).toBeTruthy();
		interactable?.dispatchEvent(LEFT.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(UP.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		expect(onLeft).toHaveBeenCalled();
		expect(onRight).toHaveBeenCalled();
		expect(onUp).toHaveBeenCalled();
		expect(onDown).toHaveBeenCalled();
	});

	it('should block events from Interactable to container with BlockNavigation', () => {
		const { container } = render(
			<FocusRoot>
				<Container
					onLeft={onLeft}
					onRight={onRight}
					onUp={onUp}
					onDown={onDown}
				>
					<BlockNavigation>
						<Interactable id="test" onPress={onPress}>
							Test
						</Interactable>
					</BlockNavigation>
				</Container>
			</FocusRoot>,
		);
		const interactable = container.querySelector('#test');
		expect(interactable).toBeTruthy();
		interactable?.dispatchEvent(LEFT.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(UP.toKeyboardEvent('keydown'));
		interactable?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		expect(onLeft).not.toHaveBeenCalled();
		expect(onRight).not.toHaveBeenCalled();
		expect(onUp).not.toHaveBeenCalled();
		expect(onDown).not.toHaveBeenCalled();
	});
});
