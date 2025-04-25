import {
	type ComponentProps,
	type ComponentType,
	type RefObject,
	useCallback,
	useContext,
	useRef,
} from 'react';
import { Input } from '../input';
import { VirtualKeyboardContainerContext } from './VirtualKeyboardContainer';

export const InputWithVirtualKeyboard = ({
	VirtualKeyboard,
	...props
}: ComponentProps<typeof Input> & {
	VirtualKeyboard: ComponentType<{
		onDone: () => void;
		inputRef: RefObject<HTMLInputElement | null>;
	}>;
}) => {
	const { open, close } = useContext(VirtualKeyboardContainerContext);
	const inputRef = useRef<HTMLInputElement>(null);

	const onInteractablePress = useCallback(() => {
		open(<VirtualKeyboard onDone={close} inputRef={inputRef} />);
		return true;
	}, [open, close, VirtualKeyboard]);

	return (
		<Input
			{...props}
			inputRef={inputRef}
			onInteractablePress={onInteractablePress}
		/>
	);
};
