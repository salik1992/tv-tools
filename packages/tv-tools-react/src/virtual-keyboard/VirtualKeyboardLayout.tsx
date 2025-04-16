import {
	type CSSProperties,
	type ComponentType,
	type PropsWithChildren,
	useMemo,
	useState,
} from 'react';
import type { TableFocusContainer } from '@salik1992/tv-tools/focus';
import {
	VirtualKeyboard,
	type VirtualKeyboardLayouts,
} from '@salik1992/tv-tools/virtual-keyboard';
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
}) => {
	const keyboard = useMemo(
		() => new VirtualKeyboard(layouts, container),
		[container, layouts],
	);
	const [renderData, setRenderData] = useState(keyboard.getRenderData());

	bindListener('renderData', keyboard, setRenderData);
	bindListener('addChar', keyboard, onAddChar);
	bindListener('removeChar', keyboard, onRemoveChar);
	bindListener('done', keyboard, onDone);

	const className = useMemo(() => {
		let className = 'virtual-keyboard';
		className += ` ${renderData.layoutName}`;
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
