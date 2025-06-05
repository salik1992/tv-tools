import { useCallback } from 'react';
import {
	FocusContext,
	Interactable,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useModal } from '../../hooks/useModal';
import { ScrollableText } from '../ScrollableText';
import { P } from '../Typography';
import * as css from './Overview.module.scss';

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
			<Interactable
				className={css.wrap}
				onPress={onPress}
				onFocus={onFocus}
				focusOnMount={focusOnMount}
			>
				<P>{overview}</P>
			</Interactable>
		</FocusContext.Provider>
	);
};
