import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { H1 } from './Typography';

export const NotFound = () => {
	const navigate = useNavigate();

	const back = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	return (
		<Screen>
			<ScreenCentered>
				<H1>Not Found</H1>
				<Button onPress={back} focusOnMount>
					Back
				</Button>
			</ScreenCentered>
		</Screen>
	);
};
