import {
	type ComponentProps,
	type ReactNode,
	createContext,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { noop } from '@salik1992/tv-tools/utils/noop';

export const VirtualKeyboardContainerContext = createContext<{
	open: (node: ReactNode) => void;
	close: () => void;
}>({
	open: noop,
	close: noop,
});

/**
 * VirtualKeyboardProvider is a component that provides a context for managing
 * the virtual keyboard as well as the keyboard container.
 * @prop children - The children to render inside the provider but outside the container.
 * @prop ...props - Additional props that will be passed to the keyboard div container.
 * @example
 * ```typescriptreact
 * const App = () => (
 *     <VirtualKeyboardProvider className="keyboard-container">
 *         <Router>...</Router>
 *     </VirtualKeyboardProvider>
 * );
 * ```
 * Will render Router, followed by `<div className="keyboard-container" />`.
 * When the keyboard is open, it will be rendered inside this div.
 */
export const VirtualKeyboardProvider = ({
	children,
	...props
}: ComponentProps<'div'>) => {
	const [keyboard, setKeyboard] = useState<ReactNode | null>(null);

	const open = useCallback(
		(node: ReactNode) => {
			setKeyboard(node);
		},
		[setKeyboard],
	);

	const close = useCallback(() => {
		setKeyboard(null);
	}, [setKeyboard]);

	const value = useMemo(
		() => ({
			open,
			close,
		}),
		[open, close],
	);

	return (
		<VirtualKeyboardContainerContext.Provider value={value}>
			{children}
			<div {...props}>{keyboard}</div>
		</VirtualKeyboardContainerContext.Provider>
	);
};
