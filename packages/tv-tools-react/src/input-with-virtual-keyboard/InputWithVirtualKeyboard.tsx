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

/**
 * InputWithVirtualKeyboard is a component that renders the Input from '@salik1992/tv-tools-react/input'
 * and adds a virtual keyboard to it.
 * @prop VirtualKeyboard - The virtual keyboard component to use.
 * @prop ...props - Additional props to pass to the Input component.
 * @example
 * ```typescriptreact
 * import { InputWithVirtualKeyboard } from '@salik1992/tv-tools-react/input-with-virtual-keyboard';
 * import { EmailKeyboard, GenericKeyboard } from './VirtualKeyboard';
 *
 * const SignInForm = ({ onChangeEmail, onChangePassword }) => (
 *     <>
 *         <Label for="email">Email</Label>
 *         <InputWithVirtualKeyboard
 *             id="email"
 *             type="email"
 *             placeholder="Email"
 *             onChange={onChangeEmail}
 *             VirtualKeyboard={EmailKeyboard}
 *         />
 *         <Label for="password">Password</Label>
 *         <InputWithVirtualKeyboard
 *             id="password"
 *             type="password"
 *             placeholder="Password"
 *             onChange={onChangePassword}
 *             VirtualKeyboard={GenericKeyboard}
 *         />
 *     </>
 * );
 */
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
