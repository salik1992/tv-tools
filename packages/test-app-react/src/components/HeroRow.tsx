import { type FocusEvent, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type { RenderDataElement } from '@salik1992/tv-tools/list';
import { BasicList } from '@salik1992/tv-tools/list/BasicList';
import { List } from '@salik1992/tv-tools-react/list';
import { type ListDataConfiguration } from '../data';
import { usePagedData } from '../hooks/usePagedData';
import { Hero } from './Hero';
import { MouseArrows } from './MouseArrows';
import { Performance, Transition } from './Theme';
import { H3, Typography } from './Typography';

const Wrap = styled.div`
	margin-top: 15px;

	.list {
		position: relative;
		white-space: nowrap;
		padding: 50px 0;
		box-sizing: border-box;
		${MouseArrows}

		.mouse-arrow {
			height: ${22 * Typography.row}px;
			&.next {
				right: -${3 * Typography.column}px;
				width: ${49 * Typography.column}px;
			}

			&.previous {
				left: -${3 * Typography.column}px;
				width: ${6 * Typography.column}px;
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
		${Transition('transform')}
	}
`;

const P = styled(H3)`
	height: ${Hero.height}px;
	line-height: ${Hero.height}px;
	vertical-align: middle;
`;

export const HeroRow = ({
	id,
	listData,
	focusOnMount = false,
	onFocus,
}: {
	id?: string;
	listData: ListDataConfiguration;
	focusOnMount?: boolean;
	onFocus?: (event: FocusEvent) => void;
}) => {
	const { data, loading, error } = usePagedData(listData);

	const hasData = useMemo(() => (data[0]?.length ?? 0) > 0, [data[0]]);

	const listConfiguration = useMemo(
		() => ({
			performance: Performance,
			dataLength: data[0]?.length,
			visibleElements: 5,
			config: {
				navigatableElements: 2,
				scrolling: {
					first: Hero.width,
					other: Hero.width,
				},
			},
		}),
		[data[0]?.length],
	);

	const renderElement = useCallback(
		({ id, dataIndex, offset, onFocus }: RenderDataElement) => (
			<Hero
				id={id}
				key={id}
				asset={data[0][dataIndex]}
				style={{
					transform: `translateX(${offset}px)`,
				}}
				onFocus={onFocus}
			/>
		),
		[data[0]],
	);

	return (
		<Wrap onFocus={onFocus}>
			{loading && <P>Loading...</P>}
			{error !== null && data.pages === 0 && (
				<P>There was an error loading the data.</P>
			)}
			{!loading && !error && !hasData && <P>Nothing was found.</P>}
			{hasData && (
				<>
					<List
						id={id}
						Implementation={BasicList}
						configuration={listConfiguration}
						renderItem={renderElement}
						focusOnMount={focusOnMount}
					/>
				</>
			)}
		</Wrap>
	);
};
