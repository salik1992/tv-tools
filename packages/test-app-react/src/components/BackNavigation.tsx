import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useFocusContainer,
	FocusContext,
} from '@salik1992/tv-tools-react/focus';

export const BackNavigation = ({ children }: PropsWithChildren<{}>) => {
	const { focusContextValue, useOnBack } = useFocusContainer();
	const navigate = useNavigate();

	useOnBack(() => {
		navigate(-1);
	}, [navigate]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};
