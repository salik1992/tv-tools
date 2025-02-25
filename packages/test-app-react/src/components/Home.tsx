import { AssetsRow } from './AssetsRow';
import { Screen } from './Screen';

export const Home = () => {
	return (
		<Screen>
			<AssetsRow
				list={{ from: 'discover', type: 'movie' }}
				header="TMDB Discover Movies"
			/>
			<AssetsRow
				list={{ from: 'discover', type: 'tv' }}
				header="TMDB Discover TV"
			/>
		</Screen>
	);
};
