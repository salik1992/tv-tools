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
