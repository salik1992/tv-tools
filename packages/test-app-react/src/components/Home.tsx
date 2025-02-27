import { useState } from 'react';
import styled from 'styled-components';
import { VerticalFocus } from '@salik1992/tv-tools-react/focus';
import { AssetsRow } from './AssetsRow';
import { HeroRow } from './HeroRow';
import { Screen } from './Screen';

const SCROLLS = [0, 500, 700, 900];

const InnerWrap = styled.div`
	transition: transform 300ms;
`;

export const Home = () => {
	const [scroll, setScroll] = useState(0);

	return (
		<Screen withMenu>
			<InnerWrap style={{ transform: `translateY(-${scroll}px)` }}>
				<VerticalFocus>
					<HeroRow
						list={{
							from: 'trending',
							type: 'movie',
							timeWindow: 'day',
						}}
						onFocus={() => setScroll(SCROLLS[0])}
						focusOnMount
					/>
					<AssetsRow
						list={{
							from: 'trending',
							type: 'tv',
							timeWindow: 'day',
						}}
						header="Trending TV"
						onFocus={() => setScroll(SCROLLS[1])}
					/>
					<AssetsRow
						list={{ from: 'discover', type: 'movie' }}
						header="Discover Movies"
						onFocus={() => setScroll(SCROLLS[2])}
					/>
					<AssetsRow
						list={{ from: 'discover', type: 'tv' }}
						header="Discover TV"
						onFocus={() => setScroll(SCROLLS[3])}
					/>
				</VerticalFocus>
			</InnerWrap>
		</Screen>
	);
};
