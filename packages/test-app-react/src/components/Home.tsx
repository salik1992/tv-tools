import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { AssetsRow } from './AssetsRow';
import { Screen } from './Screen';

export const Home = () => {
	return (
		<Screen>
			<VerticalFocus>
				<AssetsRow
					list={{ from: 'discover', type: 'movie' }}
					header="TMDB Discover Movies"
					focusOnMount
				/>
				<AssetsRow
					list={{ from: 'discover', type: 'tv' }}
					header="TMDB Discover TV"
				/>
			</VerticalFocus>
		</Screen>
	);
};
