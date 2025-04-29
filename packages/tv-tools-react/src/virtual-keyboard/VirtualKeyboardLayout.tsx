import {
	type CSSProperties,
	type ComponentType,
	type KeyboardEvent,
	type PropsWithChildren,
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	ControlEvent,
	type TableFocusContainer,
	focus,
} from '@salik1992/tv-tools/focus';
import type { VirtualKeyboardLayouts } from '@salik1992/tv-tools/virtual-keyboard';
import { VirtualKeyboardBase } from './VirtualKeyboardBase';
import { useBindListener } from './useBindListener';

/**
 * VirtualKeyboardLayout is a component that renders a virtual keyboard layout.
 * It uses the VirtualKeyboardBase class to manage the keyboard state.
 * @prop layouts - The layouts to use for the keyboard.
 * @prop container - The focus container to use for the keyboard.
 * @prop Keyboard - The component to use for the keyboard (main wrapper).
 * @prop FocusTr - The component to use for the rows of the keyboard.
 * @prop FocusTd - The component to use for the keys of the keyboard.
 * @prop onAddChar - Callback function to call when a character is added.
 * @prop onRemoveChar - Callback function to call when a character should be removed.
 * @prop onDone - Callback function to call when the keyboard input is done.
 * @prop inputRef - Ref to the input element that the keyboard is controlling.
 */
export const VirtualKeyboardLayout = ({
	layouts,
	container,
	Keyboard,
	FocusTr,
	FocusTd,
	onAddChar,
	onRemoveChar,
	onDone,
	inputRef,
}: {
	layouts: VirtualKeyboardLayouts;
	container: TableFocusContainer;
	Keyboard: ComponentType<
		PropsWithChildren<{ className?: string; style?: CSSProperties }>
	>;
	FocusTr: ComponentType<PropsWithChildren>;
	FocusTd: ComponentType<
		PropsWithChildren<{
			id?: string;
			colSpan?: number;
			rowSpan?: number;
			className?: string;
		}>
	>;
	onAddChar?: (char: string) => void;
	onRemoveChar?: () => void;
	onDone?: () => void;
	inputRef?: RefObject<HTMLInputElement | null>;
}) => {
	const keyboard = useMemo(() => new VirtualKeyboardBase(layouts), [layouts]);
	const [renderData, setRenderData] = useState(keyboard.getRenderData());

	// Internally used listener
	useBindListener('renderData', keyboard, setRenderData);

	// Passthrough listeners
	useBindListener('addChar', keyboard, onAddChar);
	useBindListener('removeChar', keyboard, onRemoveChar);
	useBindListener('done', keyboard, onDone);

	// Passtrough keydown event from HW keyboard typing
	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			keyboard.onKeyDown(event.nativeEvent);
		},
		[keyboard],
	);
	useEffect(() => {
		const params = [
			container.id,
			onKeyDown as (event: ControlEvent) => boolean,
			'keydown',
			'bubble',
		] as const;
		focus.addEventListener(...params);
		return () => {
			focus.removeEventListener(...params);
		};
	}, [onKeyDown]);

	// Assign input to keyboard
	useEffect(() => {
		keyboard.assignInput(inputRef?.current ?? undefined);
		return () => {
			keyboard.assignInput(undefined);
		};
	}, [keyboard, inputRef?.current]);

	const className = useMemo(() => {
		let className = 'virtual-keyboard';
		className += ` layout-${renderData.layoutName}`;
		if (renderData.effect !== undefined) {
			className += ` effect-${renderData.effect}`;
		}
		return className;
	}, [renderData.effect, renderData.layoutName]);

	return (
		<Keyboard className={className}>
			{renderData.layout.map((row, rowIndex) => (
				<FocusTr key={rowIndex}>
					{row.map((key) => {
						const { key: keyId, ...props } = key;
						const id = `${container.id}-vk-${keyId}`;
						return (
							<FocusTd
								key={id}
								id={id}
								className={`vk-${keyId}`}
								{...props}
							>
								{key.label}
							</FocusTd>
						);
					})}
				</FocusTr>
			))}
		</Keyboard>
	);
};
