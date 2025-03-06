import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { FocusRoot } from '@salik1992/tv-tools-react/focus';
import { BackNavigation } from './BackNavigation';
import { Detail } from './Detail';
import { Disclaimer } from './Disclaimer';
import { Home } from './Home';
import { NotFound } from './NotFound';

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
			<FocusRoot alwaysPreventNavigationalEvents>
				<Router>
					<BackNavigation>
						<Routes>
							<Route path="*" element={<NotFound />} />
							<Route path="/" element={<Home />} />
							<Route
								path="/detail/:type/:id"
								element={<Detail />}
							/>
						</Routes>
					</BackNavigation>
				</Router>
			</FocusRoot>
			<Disclaimer />
		</>
	);
};
