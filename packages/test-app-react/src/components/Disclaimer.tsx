import styled from 'styled-components';

const Wrap = styled.div`
	position: fixed;
	bottom: 0;
	right: 0;
	background-color: #000000;
	color: #aaaaaa;
	border-left: 3px solid #ffff00;
	border-top: 3px solid #ffff00;
	padding: 10px 20px;
	line-height: 1.25em;
`;

export const Disclaimer = () => (
	<Wrap>
		The data for the application are provided by
		<br />
		The Movie Database at https://www.themoviedb.org
	</Wrap>
);
