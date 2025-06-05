import {
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
	createContext,
	useCallback,
	useState,
} from 'react';
import {
	BlockNavigation,
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import * as css from './Modal.module.scss';

const noop = () => false;

type ModalSize = 'small' | 'large';

export const ModalContext = createContext<{
	open: (content: ReactNode, size?: ModalSize) => boolean;
	close: () => boolean;
}>({
	open: noop,
	close: noop,
});

const Modal = ({
	children,
	size,
	onClose,
}: PropsWithChildren<{ size: ModalSize; onClose: () => boolean }>) => {
	const { focusContextValue, useOnBack } = useFocusContainer();
	useOnBack(onClose);

	const onClick = useCallback(
		(event: MouseEvent) => {
			if (onClose()) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		[onClose],
	);

	return (
		<BlockNavigation>
			<FocusContext.Provider value={focusContextValue}>
				<div className={css.wrap}>
					<div className={css.backdrop} onClick={onClick} />
					<div className={`${css['inner-wrap']} ${css[size]}`}>
						<div className={css.content}>{children}</div>
					</div>
				</div>
			</FocusContext.Provider>
		</BlockNavigation>
	);
};

export const ModalProvider = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const [size, setSize] = useState<ModalSize>('large');
	const [content, setContent] = useState<ReactNode | null>(null);

	const open = useCallback(
		(newContent: ReactNode, size: ModalSize = 'large') => {
			setIsOpen(true);
			setSize(size);
			setContent(newContent);
			return true;
		},
		[setIsOpen, setContent],
	);

	const close = useCallback(() => {
		setIsOpen(false);
		setContent(null);
		return true;
	}, [setIsOpen, setContent]);

	return (
		<ModalContext.Provider value={{ open, close }}>
			{children}
			{isOpen && (
				<Modal onClose={close} size={size}>
					{content}
				</Modal>
			)}
		</ModalContext.Provider>
	);
};
