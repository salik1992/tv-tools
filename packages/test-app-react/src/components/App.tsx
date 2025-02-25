import { createGlobalStyle } from 'styled-components';
import { Home } from './Home';

const GlobalStyles = createGlobalStyle`
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
			<Home />
		</>
	);
};
