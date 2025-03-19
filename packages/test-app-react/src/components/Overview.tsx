import { useCallback } from 'react';
import styled from 'styled-components';
import {
	FocusContext,
	Interactable,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useModal } from './Modal';
import { ScrollableText } from './ScrollableText';
import { Border, Colors, Transition } from './Theme';
import { P, Typography, nLineEllipsis } from './Typography';

const Text = styled(Interactable)`
	padding: ${Typography.column}px ${Typography.column}px;
	max-width: ${50 * Typography.column}px;
	cursor: pointer;
	outline: none;
	${Border}

	${P} {
		color: ${Colors.fg.secondary};
		${Transition('color')}
		${nLineEllipsis(3)}
	}

	&:focus {
		${P} {
			color: ${Colors.fg.primary};
		}
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
	const modal = useModal();

	const onClose = useCallback(() => {
		modal.close();
		return true;
	}, [modal]);

	const onPress = useCallback(() => {
		modal.open(
			<ScrollableText onClose={onClose}>{overview}</ScrollableText>,
		);
		return true;
	}, [modal]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<Text
				onPress={onPress}
				onFocus={onFocus}
				focusOnMount={focusOnMount}
			>
				<P>{overview}</P>
			</Text>
		</FocusContext.Provider>
	);
};
