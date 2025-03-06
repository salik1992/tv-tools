import { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
	useFocusContainer,
	FocusContext,
	Interactable,
} from '@salik1992/tv-tools-react/focus';
import { nLineEllipsis, P } from './Typography';
import { ScrollableTextModal } from './ScrollableTextModal';

const Text = styled(Interactable)`
	margin-left: -8px;
	padding: 10px;
	box-sizing: border-box;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	border-radius: 5px;
	background-color: transparent;
	max-width: 750px;
	cursor: pointer;
	transition:
		border-color 300ms,
		background-color 300ms;
	outline: none;

	${P} {
		${nLineEllipsis(3)}
	}

	&:focus {
		border-color: #ffffff;
		background-color: rgba(102, 102, 153, 0.25);
	}
`;

export const Overview = ({
	overview = 'No overview available',
	onFocus,
	focusOnMount = false,
}: {
	overview?: string;
	onFocus?: () => void;
	focusOnMount?: boolean;
}) => {
	const { focusContextValue } = useFocusContainer();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const onPress = useCallback(() => {
		setIsModalVisible(true);
		return true;
	}, [setIsModalVisible]);

	const onClose = useCallback(() => {
		setIsModalVisible(false);
		return true;
	}, [setIsModalVisible]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<Text
				onPress={onPress}
				onFocus={onFocus}
				focusOnMount={focusOnMount}
			>
				<P>{overview}</P>
			</Text>
			{isModalVisible && (
				<ScrollableTextModal onClose={onClose}>
					{overview}
				</ScrollableTextModal>
			)}
		</FocusContext.Provider>
	);
};
