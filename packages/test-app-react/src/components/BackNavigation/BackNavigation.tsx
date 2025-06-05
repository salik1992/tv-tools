import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { useMenuItems } from '../../hooks/useMenuItems';
import { getCurrentPath } from '../../utils/getCurrentPath';
import { menuItemToPath } from '../../utils/menuItemToPath';

export const BackNavigation = ({ children }: PropsWithChildren) => {
	const [home] = useMenuItems();
	const initialNavigationDone = useRef(getCurrentPath() !== '');
	const { focusContextValue, useOnBack } = useFocusContainer();
	const navigate = useNavigate();

	useEffect(() => {
		if (!initialNavigationDone.current && home) {
			navigate(menuItemToPath(home));
			initialNavigationDone.current = true;
		}
	}, [home]);

	useOnBack(() => {
		navigate(menuItemToPath(home));
		return true;
	}, [navigate, home]);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};
