import { type ComponentType, Fragment, type RefObject } from 'react';
import type { TableFocusContainer } from '@salik1992/tv-tools/focus';
import type { VirtualKeyboardLayouts } from '@salik1992/tv-tools/virtual-keyboard';
import { FocusTable, type FocusTableRenderComponents } from '../focus';
import { BlockNavigation } from '../utils/BlockNavigation';
import { VirtualKeyboardLayout } from './VirtualKeyboardLayout';

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
