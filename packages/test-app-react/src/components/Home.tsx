import { type PropsWithChildren, useCallback, useState } from 'react';
import styled from 'styled-components';
import { focus } from '@salik1992/tv-tools/focus';
import {
	FocusContext,
	VerticalFocus,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { AssetsRow } from './AssetsRow';
import { HeroRow } from './HeroRow';
import { Screen } from './Screen';
import { Transition } from './Theme';

const HERO = 'hero';
const SCROLLS = [0, 500, 800, 1100];

const InnerWrap = styled.div`
	${Transition('transform')}
`;

const OnBackScrollTop = ({
	onBack,
	children,
}: PropsWithChildren<{ onBack: () => boolean }>) => {
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
							listData={{
								filterBy: 'trending',
								type: 'movie',
								timeWindow: 'day',
							}}
							onFocus={() => setScroll(SCROLLS[0])}
							focusOnMount
						/>
						<AssetsRow
							listData={{
								filterBy: 'trending',
								type: 'series',
								timeWindow: 'day',
							}}
							header="Trending TV"
							onFocus={() => setScroll(SCROLLS[1])}
						/>
						<AssetsRow
							listData={{ filterBy: 'discover', type: 'movie' }}
							header="Discover Movies"
							onFocus={() => setScroll(SCROLLS[2])}
						/>
						<AssetsRow
							listData={{ filterBy: 'discover', type: 'series' }}
							header="Discover TV"
							onFocus={() => setScroll(SCROLLS[3])}
						/>
					</VerticalFocus>
				</OnBackScrollTop>
			</InnerWrap>
		</Screen>
	);
};
