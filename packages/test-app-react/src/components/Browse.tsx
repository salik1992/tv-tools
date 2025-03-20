import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { focus } from '@salik1992/tv-tools/focus';
import {
	FocusContext,
	VerticalFocus,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { ListType } from '@salik1992/test-app-data/types';
import { validateId } from '@salik1992/test-app-data/validations';
import { useAssertedParams } from '../hooks/useAssertedParams';
import { useBrowseData } from '../hooks/useBrowseData';
import { AssetsRow } from './AssetsRow';
import { HeroRow } from './HeroRow';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { Transition } from './Theme';
import { H1 } from './Typography';

const TOP = 'top-row-at-';
const SCROLLS = {
	[ListType.HERO]: 500,
	[ListType.NORMAL]: 300,
};

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

export const Browse = () => {
	const { browseId } = useAssertedParams({ browseId: validateId });
	const [index, setIndex] = useState(0);
	const topRowId = `${TOP}${browseId}`;
	const { data, loading, error } = useBrowseData(browseId);
	const scrolls = useMemo(
		() =>
			data?.reduce((acc, { listType }) => {
				if (acc.length === 0) {
					return [0];
				}
				return [...acc, acc[acc.length - 1] + SCROLLS[listType]];
			}, [] as number[]) ?? [0],
		[data],
	);
	const scroll = scrolls.at(index);

	const onBack = useCallback(() => {
		if (scroll !== 0) {
			if (focus.hasFocusId(topRowId)) {
				focus.focus(topRowId, { preventScroll: true });
			}
			return true;
		}
		return false;
	}, [scroll]);

	const onFocuses = useMemo(
		() =>
			data?.map((_, i) => {
				return () => setIndex(i);
			}) ?? [],
		[data],
	);

	return (
		<Screen>
			<InnerWrap style={{ transform: `translateY(-${scroll}px)` }}>
				<OnBackScrollTop onBack={onBack}>
					<VerticalFocus>
						{loading && (
							<ScreenCentered>
								<H1>Loading...</H1>
							</ScreenCentered>
						)}
						{!!error && (
							<ScreenCentered>
								<H1>There was an error loading the data.</H1>
							</ScreenCentered>
						)}
						{!loading && !error && !data && (
							<ScreenCentered>
								<H1>No data available.</H1>
							</ScreenCentered>
						)}
						{data &&
							data.map(({ title, listType, listData, id }, i) => {
								const focusId = i === 0 ? topRowId : undefined;
								const key = `${browseId}-${id}`;
								switch (listType) {
									case ListType.HERO:
										return (
											<HeroRow
												key={key}
												id={focusId}
												listData={listData}
												onFocus={onFocuses[i]}
												focusOnMount={i === 0}
											/>
										);
									case ListType.NORMAL:
										return (
											<AssetsRow
												key={key}
												id={focusId}
												listData={listData}
												header={title}
												showDetail={index === i}
												onFocus={onFocuses[i]}
											/>
										);
									default:
										return null;
								}
							})}
					</VerticalFocus>
				</OnBackScrollTop>
			</InnerWrap>
		</Screen>
	);
};
