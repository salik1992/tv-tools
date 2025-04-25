import { type ComponentType, Fragment, type RefObject } from 'react';
import type { TableFocusContainer } from '@salik1992/tv-tools/focus';
import type { VirtualKeyboardLayouts } from '@salik1992/tv-tools/virtual-keyboard';
import {
	BlockNavigation,
	FocusTable,
	type FocusTableRenderComponents,
} from '../focus';
import { VirtualKeyboardLayout } from './VirtualKeyboardLayout';

/**
 * VirtualKeyboard is a component that renders a virtual keyboard.
 * It uses the FocusTable component to manage focus and navigation.
 * @prop layouts - The layouts to use for the keyboard.
 * @prop blockNavigation - Whether to block navigation outside the keyboard. (default: false)
 * @prop Keyboard - The component to use for the keyboard (main wrapper).
 * @prop Row - The component to use for the rows of the keyboard.
 * @prop Key - The component to use for the keys of the keyboard.
 * @param onAddChar - Callback function to call when a character is added.
 * Not required if you are using the keyboard as part of InputWithVirtualKeyboard.
 * @param onRemoveChar - Callback function to call when a character should be removed.
 * Not required if you are using the keyboard as part of InputWithVirtualKeyboard.
 * @param onDone - Callback function to call when the keyboard input is done.
 * Not required if you are using the keyboard as part of InputWithVirtualKeyboard.
 * @param inputRef - Ref to the input element that the keyboard is controlling.
 * Not required if you are using the keyboard as part of InputWithVirtualKeyboard.
 * @example
 * ```typescriptreact
 * // SIMPLIFIED
 * import { VirtualKeyboard } from '@salik1992/tv-tools-react/virtual-keyboard';
 *
 * export const Keyboard = () => (
 *     <VirtualKeyboard
 *         layouts={[
 *             ['a', 'b', 'c', 'd', 'e'],
 *             ['f', 'g', 'h', 'i', 'j'],
 *             ['k', 'l', 'm', 'n', 'o'],
 *             ['p', 'q', 'r', 's', 't'],
 *             ['u', 'v', 'w', 'x', 'y'],
 *             ['z', ' ', '.', '.com', '@'],
 *         ]}
 *         Keyboard="div"
 *         Row="div"
 *         Key={Interactable}
 *     />
 * )
 */
export const VirtualKeyboard = ({
	layouts,
	blockNavigation = false,
	Keyboard,
	Row,
	Key,
	onAddChar,
	onRemoveChar,
	onDone,
	inputRef,
}: {
	layouts: VirtualKeyboardLayouts;
	Keyboard: ComponentType;
	Row: ComponentType;
	Key: ComponentType;
	blockNavigation?: boolean;
	onAddChar?: (char: string) => void;
	onRemoveChar?: () => void;
	onDone?: () => void;
	inputRef?: RefObject<HTMLInputElement | null>;
}) => {
	const Blocker = blockNavigation ? BlockNavigation : Fragment;
	return (
		<Blocker>
			<FocusTable
				TableComponent={Fragment}
				TrComponent={Row}
				TdComponent={Key}
			>
				{(
					{
						FocusTr,
						FocusTd,
					}: FocusTableRenderComponents<typeof Row, typeof Key>,
					container: TableFocusContainer,
				) => (
					<VirtualKeyboardLayout
						layouts={layouts}
						container={container}
						Keyboard={Keyboard}
						FocusTr={FocusTr}
						FocusTd={FocusTd}
						onAddChar={onAddChar}
						onRemoveChar={onRemoveChar}
						onDone={onDone}
						inputRef={inputRef}
					/>
				)}
			</FocusTable>
		</Blocker>
	);
};
