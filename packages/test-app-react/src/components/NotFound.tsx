import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Screen } from './Screen';
import { H1 } from './Typography';
import { Button } from './Button';

const Wrap = styled.div`
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
	text-align: center;
`;

export const NotFound = () => {
	const navigate = useNavigate();

	const back = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	return (
		<Screen>
			<Wrap>
				<H1>Not Found</H1>
				<Button onPress={back} focusOnMount>
					Back
				</Button>
			</Wrap>
		</Screen>
	);
};
