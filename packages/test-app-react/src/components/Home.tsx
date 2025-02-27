import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { AssetsRow } from './AssetsRow';
import { HeroRow } from './HeroRow';
import { Screen } from './Screen';

export const Home = () => {
	return (
		<Screen withMenu>
			<VerticalFocus>
				<HeroRow
					list={{
						from: 'trending',
						type: 'movie',
						timeWindow: 'day',
					}}
					header="Trending Movies"
					focusOnMount
				/>
				<AssetsRow
					list={{ from: 'trending', type: 'tv', timeWindow: 'day' }}
					header="Trending TV"
				/>
				<AssetsRow
					list={{ from: 'discover', type: 'movie' }}
					header="Discover Movies"
				/>
				<AssetsRow
					list={{ from: 'discover', type: 'tv' }}
					header="Discover TV"
				/>
			</VerticalFocus>
		</Screen>
	);
};
