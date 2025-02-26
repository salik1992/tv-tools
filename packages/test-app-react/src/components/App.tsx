import { createGlobalStyle } from 'styled-components';
import { FocusRoot } from '@salik1992/tv-tools-react/focus';
import { Home } from './Home';

const GlobalStyles = createGlobalStyle`
html, body {
    margin: 0;
    padding: 0;
}
body {
    background-color: #22222f;
    font-family: sans-serif;
    color: #ffffff;
}
`;

export const App = () => {
	return (
		<>
			<GlobalStyles />
			<FocusRoot>
				<Home />
			</FocusRoot>
		</>
	);
};
