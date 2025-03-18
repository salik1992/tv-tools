import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { FocusRoot } from '@salik1992/tv-tools-react/focus';
import { BackNavigation } from './BackNavigation';
import { Detail } from './Detail';
import { Disclaimer } from './Disclaimer';
import { Home } from './Home';
import { NotFound } from './NotFound';
import { Colors } from './Theme';
import { ModalProvider } from './Modal';

const GlobalStyles = createGlobalStyle`
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

export const App = () => {
	return (
		<>
			<GlobalStyles />
			<FocusRoot alwaysPreventNavigationalEvents>
				<ModalProvider>
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
				</ModalProvider>
			</FocusRoot>
			<Disclaimer />
		</>
	);
};
