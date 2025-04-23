import {
	type CSSProperties,
	type ComponentType,
	type PropsWithChildren,
	type RefObject,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { TableFocusContainer } from '@salik1992/tv-tools/focus';
import { type VirtualKeyboardLayouts } from '@salik1992/tv-tools/virtual-keyboard';
import { VirtualKeyboardBase } from './VirtualKeyboardBase';
import { bindListener } from './bindListener';

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
	const keyboard = useMemo(
		() => new VirtualKeyboardBase(layouts, container),
		[container, layouts],
	);
	const [renderData, setRenderData] = useState(keyboard.getRenderData());

	bindListener('renderData', keyboard, setRenderData);
	bindListener('addChar', keyboard, onAddChar);
	bindListener('removeChar', keyboard, onRemoveChar);
	bindListener('done', keyboard, onDone);

	useEffect(() => {
		keyboard.assignInput(inputRef?.current ?? undefined);
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
