import { useCallback, type PropsWithChildren, type MouseEvent } from 'react';
import styled from 'styled-components';
import {
	useFocusContainer,
	FocusContext,
} from '@salik1992/tv-tools-react/focus';

const Wrap = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.75);
`;

const InnerWrap = styled.div`
	position: absolute;
	top: 150px;
	bottom: 150px;
	left: 290px;
	right: 290px;
	padding: 50px 90px;
	background-color: #22222f;
	border-radius: 20px;
`;

const Backdrop = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`;

const Content = styled.div`
	height: 680px;
	overflow: hidden;
`;

const blockEvent = () => true;

export const Modal = ({
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
