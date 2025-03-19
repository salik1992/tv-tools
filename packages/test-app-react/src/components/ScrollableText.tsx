import {
	type PropsWithChildren,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import styled from 'styled-components';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { Button } from './Button';
import { Transition } from './Theme';
import { P, Typography } from './Typography';

const Wrap = styled.div`
	position: relative;
	overflow: hidden;
	height: ${19 * Typography.row}px;
	margin-bottom: ${Typography.row}px;
`;

const Centered = styled.div`
	text-align: center;
`;

const Text = styled(P)`
	width: ${73 * Typography.column}px;
	text-align: justify;
	${Transition('transform')}
`;

const Scrollbar = styled.div`
	position: absolute;
	top: 0;
	right: 10px;
	bottom: 10px;
	width: 5px;
`;

const ScrollArrow = styled.div<{ $direction: 'up' | 'down' }>`
	position: absolute;
	${({ $direction }) => ($direction === 'up' ? 'top' : 'bottom')}: 0;
	right: 0;
	width: 5px;
	height: 5px;
`;

const Scroller = styled.div`
	position: absolute;
	top: 25px;
	right: -5px;
	width: 5px;
	transition: transform 300ms;
	background-color: #ffffff;
`;

export const ScrollableText = ({
	children,
	onClose,
}: PropsWithChildren<{ onClose: () => boolean }>) => {
	const { focusContextValue, useOnUp, useOnDown } = useFocusContainer();

	const wrap = useRef<HTMLDivElement>(null);
	const text = useRef<HTMLDivElement>(null);
	const [isScrollable, setIsScrollable] = useState(false);
	const [scroll, setScroll] = useState(0);
	const availableHeight = useRef(Number.MAX_SAFE_INTEGER);
	const scrollHeight = useRef(0);

	const scrollUp = useCallback(() => {
		setScroll((currentScroll) =>
			Math.max(
				Math.ceil(currentScroll - availableHeight.current * 0.66),
				0,
			),
		);
		return true;
	}, [setScroll, availableHeight.current, scrollHeight.current]);

	const scrollDown = useCallback(() => {
		setScroll((currentScroll) =>
			Math.min(
				Math.ceil(currentScroll + availableHeight.current * 0.66),
				scrollHeight.current - availableHeight.current,
			),
		);
		return true;
	}, [setScroll, availableHeight.current, scrollHeight.current]);

	useOnUp(scrollUp);
	useOnDown(scrollDown);

	useLayoutEffect(() => {
		if (wrap.current) {
			availableHeight.current =
				wrap.current.getBoundingClientRect().height;
		}
		if (text.current) {
			scrollHeight.current = text.current.getBoundingClientRect().height;
		}
		setIsScrollable(scrollHeight.current > availableHeight.current);
	}, [children]);

	const scrollerStyle = useMemo(() => {
		const height = Math.ceil(
			(availableHeight.current / scrollHeight.current) *
				availableHeight.current,
		);
		return {
			height,
			transform: `translateY(${(scroll * (availableHeight.current - height - 40)) / (scrollHeight.current - availableHeight.current)}px)`,
		};
	}, [scroll, availableHeight.current, scrollHeight.current]);

	const upArrowStyle = useMemo(
		() =>
			({
				visibility: scroll > 0 ? 'visible' : 'hidden',
			}) as const,
		[scroll],
	);

	const downArrowStyle = useMemo(
		() =>
			({
				visibility:
					scroll < scrollHeight.current - availableHeight.current
						? 'visible'
						: 'hidden',
			}) as const,
		[scroll, availableHeight.current, scrollHeight.current],
	);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<Wrap ref={wrap}>
				<Text
					ref={text}
					style={{ transform: `translateY(-${scroll}px)` }}
				>
					{children}
				</Text>
				{isScrollable && (
					<Scrollbar>
						<ScrollArrow $direction="up" style={upArrowStyle}>
							▲
						</ScrollArrow>
						<Scroller style={scrollerStyle} />
						<ScrollArrow $direction="down" style={downArrowStyle}>
							▼
						</ScrollArrow>
					</Scrollbar>
				)}
			</Wrap>
			<Centered>
				<Button type="primary" onPress={onClose} focusOnMount>
					Close
				</Button>
			</Centered>
		</FocusContext.Provider>
	);
};
