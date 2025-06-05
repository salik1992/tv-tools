import {
	type PropsWithChildren,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	FocusContext,
	useFocusContainer,
} from '@salik1992/tv-tools-react/focus';
import { Button } from '../Button';
import { P } from '../Typography';
import * as css from './ScrollableText.module.scss';

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
		console.log({ scrollHeight, availableHeight });
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
			<div className={css.wrap} ref={wrap}>
				<P
					className={css.text}
					ref={text}
					style={{ transform: `translateY(-${scroll}px)` }}
				>
					{children}
				</P>
				{isScrollable && (
					<div className={css.scrollbar}>
						<div
							className={`${css['scroll-arrow']} ${css.up}`}
							style={upArrowStyle}
						>
							▲
						</div>
						<div className={css.scroller} style={scrollerStyle} />
						<div
							className={`${css['scroll-arrow']} ${css.down}`}
							style={downArrowStyle}
						>
							▼
						</div>
					</div>
				)}
			</div>
			<div className={css.centered}>
				<Button type="primary" onPress={onClose} focusOnMount>
					Close
				</Button>
			</div>
		</FocusContext.Provider>
	);
};
