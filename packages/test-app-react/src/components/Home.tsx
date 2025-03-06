import { useCallback, useState, type PropsWithChildren } from 'react';
import styled from 'styled-components';
import { focus } from '@salik1992/tv-tools/focus';
import {
	useFocusContainer,
	FocusContext,
	VerticalFocus,
} from '@salik1992/tv-tools-react/focus';
import { AssetsRow } from './AssetsRow';
import { HeroRow } from './HeroRow';
import { Screen } from './Screen';

const HERO = 'hero';
const SCROLLS = [0, 500, 800, 1100];

const InnerWrap = styled.div`
	transition: transform 300ms;
`;

const OnBackScrollTop = ({
	onBack,
	children,
}: PropsWithChildren<{ onBack: () => void }>) => {
	const { focusContextValue, useOnBack } = useFocusContainer();
	useOnBack(onBack);

	return (
		<FocusContext.Provider value={focusContextValue}>
			{children}
		</FocusContext.Provider>
	);
};

export const Home = () => {
	const [scroll, setScroll] = useState(0);

	const onBack = useCallback(() => {
		if (scroll !== 0) {
			focus.focus(HERO, { preventScroll: true });
			return true;
		}
		return false;
	}, [scroll]);

	return (
		<Screen withMenu>
			<InnerWrap style={{ transform: `translateY(-${scroll}px)` }}>
				<OnBackScrollTop onBack={onBack}>
					<VerticalFocus>
						<HeroRow
							id={HERO}
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
								type: 'series',
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
							list={{ from: 'discover', type: 'series' }}
							header="Discover TV"
							onFocus={() => setScroll(SCROLLS[3])}
						/>
					</VerticalFocus>
				</OnBackScrollTop>
			</InnerWrap>
		</Screen>
	);
};
