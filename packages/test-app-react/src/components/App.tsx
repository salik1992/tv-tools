import { useEffect, useState } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { device } from '@salik1992/tv-tools/device';
import { logger as loggerGlobal, ns } from '@salik1992/tv-tools/logger';
import { FocusRoot } from '@salik1992/tv-tools-react/focus';
import { useDataProvider } from '../data';
import { BackNavigation } from './BackNavigation';
import { Browse } from './Browse';
import { Detail } from './Detail';
import { Disclaimer } from './Disclaimer';
import { Discover } from './Discover';
import { ModalProvider } from './Modal';
import { NotFound } from './NotFound';
import { ScreenCentered } from './ScreenCentered';
import { Search } from './Search';
import { Colors } from './Theme';
import { H1 } from './Typography';

loggerGlobal.use(console);
const logger = ns('[App]');

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

const BROWSE = {
	path: '/browse/:browseId',
	element: <Browse />,
};

const DETAIL = {
	path: 'detail/:assetType/:assetId',
	element: <Detail />,
};

const DISCOVER = {
	path: '/discover/:filter',
	element: <Discover />,
};

const SEARCH = {
	path: '/search',
	element: <Search />,
};

const NOT_FOUND = {
	path: '*',
	element: <NotFound />,
};

export const App = () => {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<unknown | null>(null);
	const dataProvider = useDataProvider();

	useEffect(() => {
		(async () => {
			logger.info('Initializing app with driver', device.driver);
			try {
				await Promise.all([
					dataProvider.initialize(),
					device.initialize(),
				]);
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
									<Route {...NOT_FOUND} />
									<Route {...BROWSE}>
										<Route {...DETAIL} />
									</Route>
									<Route {...DISCOVER}>
										<Route {...DETAIL} />
									</Route>
									<Route {...SEARCH}>
										<Route {...DETAIL} />
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
