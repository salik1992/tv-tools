import { type PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';

export const BackNavigation = ({
	children,
	initialRoute = '/',
}: PropsWithChildren<{
	initialRoute?: string;
}>) => {
	const { focusContextValue, useOnBack } = useFocusContainer();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.hash === '') {
			navigate(initialRoute);
		}
	});

	useOnBack(() => {
		navigate(-1);
		return true;
	}, [navigate]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};
