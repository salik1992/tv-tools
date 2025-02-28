import styled from 'styled-components';

const Wrap = styled.div`
	position: fixed;
	bottom: 0;
	right: 0;
	background-color: #000000;
	color: #cccc00;
	font-weight: bold;
	border-left: 6px dashed #ffff00;
	border-top: 6px dashed #ffff00;
	padding: 10px 20px;
	line-height: 1.5em;
`;

export const Disclaimer = () => (
	<Wrap>
		The data for the application are provided by
		<br />
		The Movie Database at https://www.themoviedb.org
	</Wrap>
);
