import { createGlobalStyle } from 'styled-components';
import { Colors } from './Theme';

export const GlobalStyles = createGlobalStyle`
html, body {
	margin: 0;
	padding: 0;
}
body {
	background-color: #000000;
	font-family: Fira Code, monospace;
	color: #ffffff;
}
#root {
	position: relative;
	background-color: ${Colors.bg.primary};
	width: 1920px;
	height: 1080px;
	overflow: hidden;
}
`;
