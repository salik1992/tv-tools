import { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { DOWN, LEFT, RIGHT, UP } from '@salik1992/tv-tools/control';
import { focus } from '@salik1992/tv-tools/focus';
import { FocusRoot } from './FocusRoot';
import { FocusTable, FocusTableRenderComponents } from './FocusTable';
import { Interactable } from './Interactable';

const onPress = jest.fn();
const focusSpy = jest.spyOn(focus, 'focus');

const Table = ({ children }: PropsWithChildren) => (
	<div className="table">{children}</div>
);

const Tr = ({ children }: PropsWithChildren) => (
	<div className="tr">{children}</div>
);

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
		expect(focusSpy).toHaveBeenCalledWith('a', {
			preventScroll: true,
		});
		container
			.querySelector('#a')
			?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('b', {
			preventScroll: true,
		});
		container
			.querySelector('#b')
			?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('c', {
			preventScroll: true,
		});
		container
			.querySelector('#c')
			?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('g', {
			preventScroll: true,
		});
		container
			.querySelector('#g')
			?.dispatchEvent(LEFT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('f', {
			preventScroll: true,
		});
		container
			.querySelector('#f')
			?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('j', {
			preventScroll: true,
		});
		container
			.querySelector('#j')
			?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('g', {
			preventScroll: true,
		});
		container
			.querySelector('#g')
			?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('k', {
			preventScroll: true,
		});
		container
			.querySelector('#k')
			?.dispatchEvent(UP.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('h', {
			preventScroll: true,
		});
		container
			.querySelector('#h')
			?.dispatchEvent(UP.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('d', {
			preventScroll: true,
		});
		container
			.querySelector('#d')
			?.dispatchEvent(RIGHT.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('e', {
			preventScroll: true,
		});
		container
			.querySelector('#e')
			?.dispatchEvent(DOWN.toKeyboardEvent('keydown'));
		expect(focusSpy).toHaveBeenCalledWith('h', {
			preventScroll: true,
		});
		unmount();
	});
});
