import {
	useCallback,
	type PropsWithChildren,
	type MouseEvent,
	createContext,
	ReactNode,
	useState,
	useContext,
} from 'react';
import styled from 'styled-components';
import {
	useFocusContainer,
	FocusContext,
} from '@salik1992/tv-tools-react/focus';
import { Border, Colors } from './Theme';
import { Typography } from './Typography';

const noop = () => false;

export const ModalContext = createContext<{
	open: (content: ReactNode) => boolean;
	close: () => boolean;
}>({
	open: noop,
	close: noop,
});

const Wrap = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	background-color: ${Colors.bg.opaque};
`;

const InnerWrap = styled.div`
	position: absolute;
	top: ${5 * Typography.row}px;
	bottom: ${5 * Typography.row}px;
	left: ${20 * Typography.column}px;
	right: ${20 * Typography.column}px;
	padding: ${3 * Typography.column}px ${6 * Typography.column}px;
	background-color: ${Colors.bg.primary};
	${Border}
	border-color: ${Colors.fg.primary};
	border-style: solid;
`;

const Backdrop = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`;

const Content = styled.div`
	height: ${23 * Typography.row}px;
	overflow: hidden;
`;

const blockEvent = () => true;

const Modal = ({
	children,
	onClose,
}: PropsWithChildren<{ onClose: () => boolean }>) => {
	const {
		focusContextValue,
		useOnBack,
		useOnLeft,
		useOnRight,
		useOnUp,
		useOnDown,
	} = useFocusContainer();
	useOnBack(onClose);
	useOnLeft(blockEvent);
	useOnRight(blockEvent);
	useOnUp(blockEvent);
	useOnDown(blockEvent);

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
		<FocusContext.Provider value={focusContextValue}>
			<Wrap>
				<Backdrop onClick={onClick} />
				<InnerWrap>
					<Content>{children}</Content>
				</InnerWrap>
			</Wrap>
		</FocusContext.Provider>
	);
};

export const ModalProvider = ({ children }: PropsWithChildren) => {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<ReactNode | null>(null);

	const open = useCallback(
		(newContent: ReactNode) => {
			setIsOpen(true);
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
			{isOpen && <Modal onClose={close}>{content}</Modal>}
		</ModalContext.Provider>
	);
};

export const useModal = () => useContext(ModalContext);
