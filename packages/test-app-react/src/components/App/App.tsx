import { useEffect, useState } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { device } from '@salik1992/tv-tools/device';
import { logger as loggerGlobal, ns } from '@salik1992/tv-tools/logger';
import { FocusProvider } from '@salik1992/tv-tools-react/focus';
import { useDataProvider } from '../../data';
import { BackNavigation } from '../BackNavigation';
import { Browse } from '../Browse';
import { Detail } from '../Detail';
import { Disclaimer } from '../Disclaimer';
import { Discover } from '../Discover';
import { ModalProvider } from '../Modal';
import { NotFound } from '../NotFound';
import { Providers } from '../Providers';
import { ScreenCentered } from '../ScreenCentered';
import { Search } from '../Search';
import { H1 } from '../Typography';
import { VirtualKeyboardProvider } from '../VirtualKeyboardProvider';
import './App.scss';

loggerGlobal.use(console);
const logger = ns('[App]');

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
			<FocusProvider alwaysPreventNavigationalEvents>
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
					<Providers
						providers={[
							ModalProvider,
							VirtualKeyboardProvider,
							Router,
							BackNavigation,
							Routes,
						]}
					>
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
					</Providers>
				)}
			</FocusProvider>
			<Disclaimer />
		</>
	);
};
