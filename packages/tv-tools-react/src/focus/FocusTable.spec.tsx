import type { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { DOWN, type Key, LEFT, RIGHT, UP } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';
import { FocusTable, type FocusTableRenderComponents } from './FocusTable';
import { Interactable } from './Interactable';

const onPress = jest.fn();
const focusSpy = jest.spyOn(focus, 'focus');

const Table = ({ children }: PropsWithChildren) => (
	<div className="table">{children}</div>
);

const Tr = ({ children }: PropsWithChildren) => (
	<div className="tr">{children}</div>
);

const expectMoveBase =
	(container: HTMLElement) => (from: string, by: Key, to: string) => {
		container
			.querySelector(`#${from}`)
			?.dispatchEvent(by.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith(to, {
			preventScroll: true,
		});
	};

describe('FocusTable', () => {
	it('should render the children', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<FocusTable>
					{() => <div className="test">Test</div>}
				</FocusTable>
			</FocusRoot>,
		);
		expect(container.innerHTML).toContain('<div class="test">Test</div>');
		unmount();
	});

	it('should move focus inside the structure', () => {
		const { container, unmount } = render(
			<FocusRoot>
				<FocusTable
					TableComponent={Table}
					TrComponent={Tr}
					TdComponent={Interactable}
				>
					{({
						FocusTr,
						FocusTd,
					}: FocusTableRenderComponents<
						typeof Tr,
						typeof Interactable
					>) => (
						<>
							<FocusTr>
								<FocusTd id="a" onPress={onPress} focusOnMount>
									a
								</FocusTd>
								<FocusTd id="b" onPress={onPress}>
									b
								</FocusTd>
								<FocusTd id="c" onPress={onPress}>
									c
								</FocusTd>
								<FocusTd id="d" onPress={onPress}>
									d
								</FocusTd>
								<FocusTd id="e" onPress={onPress}>
									e
								</FocusTd>
							</FocusTr>
							<FocusTr>
								<FocusTd id="f" onPress={onPress} colSpan={2}>
									f
								</FocusTd>
								<FocusTd id="g" onPress={onPress} rowSpan={2}>
									g
								</FocusTd>
								<FocusTd id="h" onPress={onPress} colSpan={2}>
									h
								</FocusTd>
							</FocusTr>
							<FocusTr>
								<FocusTd id="i" onPress={onPress}>
									i
								</FocusTd>
								<FocusTd id="j" onPress={onPress}>
									j
								</FocusTd>
								<FocusTd id="k" onPress={onPress} colSpan={2}>
									k
								</FocusTd>
							</FocusTr>
						</>
					)}
				</FocusTable>
			</FocusRoot>,
		);
		const expectMove = expectMoveBase(container);
		expect(focusSpy).toHaveBeenCalledWith('a', {
			preventScroll: true,
		});

		expectMove('a', RIGHT, 'b');
		expectMove('b', RIGHT, 'c');
		expectMove('c', DOWN, 'g');
		expectMove('g', LEFT, 'f');
		expectMove('f', DOWN, 'j');
		expectMove('j', RIGHT, 'g');
		expectMove('g', RIGHT, 'k');
		expectMove('k', UP, 'h');
		expectMove('h', UP, 'd');
		expectMove('d', RIGHT, 'e');
		expectMove('e', DOWN, 'h');

		unmount();
	});
});
