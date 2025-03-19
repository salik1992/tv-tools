import { useEffect, useState } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ns } from '@salik1992/tv-tools/logger';
import { FocusRoot } from '@salik1992/tv-tools-react/focus';
import { useDataProvider } from '../data';
import { BackNavigation } from './BackNavigation';
import { Browse } from './Browse';
import { Detail } from './Detail';
import { Disclaimer } from './Disclaimer';
import { ModalProvider } from './Modal';
import { NotFound } from './NotFound';
import { ScreenCentered } from './ScreenCentered';
import { Colors } from './Theme';
import { H1 } from './Typography';

const logger = ns('App');

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
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<unknown | null>(null);
	const dataProvider = useDataProvider();

	useEffect(() => {
		(async () => {
			try {
				await dataProvider.initialize();
			} catch (e: unknown) {
				logger.error(e);
				setError(e);
			} finally {
				setIsReady(true);
			}
		})();
	}, []);

	return (
		<>
			<GlobalStyles />
			<FocusRoot alwaysPreventNavigationalEvents>
				{!isReady && (
					<ScreenCentered>
						<H1>Loading...</H1>
					</ScreenCentered>
				)}
				{isReady && !!error && (
					<ScreenCentered>
						<H1>Something went wrong</H1>
					</ScreenCentered>
				)}
				{isReady && !error && (
					<ModalProvider>
						<Router>
							<BackNavigation>
								<Routes>
									<Route path="*" element={<NotFound />} />
									<Route
										path="/browse/:browseId"
										element={<Browse />}
									>
										<Route
											path="detail/:assetType/:assetId"
											element={<Detail />}
										/>
									</Route>
								</Routes>
							</BackNavigation>
						</Router>
					</ModalProvider>
				)}
			</FocusRoot>
			<Disclaimer />
		</>
	);
};
