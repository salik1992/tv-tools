import type { PropsWithChildren } from 'react';
import { FocusContext, useFocusContainer } from '../focus';

function markAsProcessed() {
	return true;
}

export const BlockNavigation = ({ children }: PropsWithChildren) => {
	const { focusContextValue, useOnLeft, useOnUp, useOnDown, useOnRight } =
		useFocusContainer();

	useOnLeft(markAsProcessed);
	useOnRight(markAsProcessed);
	useOnUp(markAsProcessed);
	useOnDown(markAsProcessed);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};
