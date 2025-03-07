import { useRef, useCallback, useMemo, useState, type FocusEvent } from 'react';
import styled from 'styled-components';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { Performance } from '@salik1992/tv-tools/utils/Performance';
import { List } from '@salik1992/tv-tools-react/list';
import { type ListDataConfiguration } from '../data';
import { usePagedData } from '../hooks/usePagedData';
import { AssetsRowDetail } from './AssetsRowDetail';
import { MouseArrows } from './MouseArrows';
import { Tile } from './Tile';
import { H2, H3 } from './Typography';

const Wrap = styled.div`
	margin-top: 15px;

	.list {
		position: relative;
		white-space: nowrap;
		overflow: hideen;
		${MouseArrows}

		.mouse-arrow {
			height: 170px;
			&.next {
				right: -40px;
				width: 170px;
			}

			&.previous {
				left: -40px;
				width: 170px;
			}
		}

		&:hover .mouse-arrow {
			opacity: 0.5;

			&:hover {
				opacity: 1;
			}
		}
	}

	.list-inner-wrap {
		transition: transform 300ms;
	}
`;

const P = styled(H3)`
	text-align: center;
	height: ${Tile.height.landscape}px;
	line-height: ${Tile.height.landscape}px;
	vertical-align: middle;
`;

export const AssetsRow = ({
	id,
	listData,
	header,
	focusOnMount = false,
	onFocus: onOuterFocus,
}: {
	id?: string;
	listData: ListDataConfiguration;
	header: string;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const [focusedIndex, setFocusedIndex] = useState(0);
	const [isFocused, setIsFocused] = useState(false);
	const isFocusDelay = useRef<number | null>(null);

	const { data, loading, error } = usePagedData(listData);

	const onFocus = useCallback(
		(event: FocusEvent) => {
			setIsFocused(true);
			if (isFocusDelay.current) {
				window.clearTimeout(isFocusDelay.current);
				isFocusDelay.current = null;
			}
			if (typeof onOuterFocus === 'function') {
				onOuterFocus(event);
			}
		},
		[setIsFocused],
	);

	const onBlur = useCallback(() => {
		isFocusDelay.current = window.setTimeout(() => {
			setIsFocused(false);
		}, 50);
	}, [setIsFocused]);

	const onDataIndex = useCallback(
		(index: number) => {
			setFocusedIndex(index);
		},
		[setFocusedIndex],
	);

	const hasData = useMemo(() => (data[1]?.length ?? 0) > 0, [data[1]]);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance.ANIMATED,
			dataLength: data[1]?.length,
			visibleElements: 9,
			navigatableElements: 7,
			config: {
				scrolling: {
					first: Tile.width.landscape / 1.3,
					other: Tile.width.landscape,
				},
			},
		}),
		[data[1]?.length],
	);

	const renderElement = useCallback(
		({ id, dataIndex, offset, onFocus }: RenderDataElement) => (
			<Tile
				id={id}
				key={id}
				asset={data[1][dataIndex]}
				style={{
					transform: `translateX(${offset}px)`,
				}}
				onFocus={onFocus}
			/>
		),
		[data[1]],
	);

	return (
		<Wrap onFocus={onFocus} onBlur={onBlur}>
			<H2>{header}</H2>
			{loading && <P>Loading...</P>}
			{error !== null && data.pages === 0 && (
				<P>There was an error loading the data</P>
			)}
			{!loading && !hasData && <P>Nothing was found.</P>}
			{hasData && (
				<>
					<List
						id={id}
						Implementation={BasicList}
						configuration={listConfiguration}
						renderItem={renderElement}
						focusOnMount={focusOnMount}
						onDataIndex={onDataIndex}
					/>
					<AssetsRowDetail
						visible={isFocused}
						asset={data[1][focusedIndex]}
					/>
				</>
			)}
		</Wrap>
	);
};
