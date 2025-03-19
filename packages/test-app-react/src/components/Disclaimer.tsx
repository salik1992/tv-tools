import styled from 'styled-components';
import { Border, Colors } from './Theme';
import { P, Typography } from './Typography';

const Wrap = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	background-color: ${Colors.bg.opaque};
	${Border}
	border-color: ${Colors.fg.warning};
	padding: ${Typography.column}px ${Typography.column}px;
`;

const Text = styled(P)`
	color: ${Colors.fg.warning};
`;

export const Disclaimer = () => (
	<Wrap>
		<Text>The data for the application are provided by</Text>
		<Text>The Movie Database (https://themoviedb.org)</Text>
	</Wrap>
);
