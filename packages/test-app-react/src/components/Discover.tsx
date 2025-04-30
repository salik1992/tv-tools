import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { RenderDataGroup } from '@salik1992/tv-tools/grid';
import { BasicGrid } from '@salik1992/tv-tools/grid/BasicGrid';
import { Grid } from '@salik1992/tv-tools-react/grid';
import type { ListDataConfiguration } from '../data';
import { useAssertedParams } from '../hooks/useAssertedParams';
import { usePagedData } from '../hooks/usePagedData';
import { MouseArrows } from './MouseArrows';
import { Screen } from './Screen';
import { ScreenCentered } from './ScreenCentered';
import { Border, Colors, Performance, Transition } from './Theme';
import { Tile } from './Tile';
import { H1, Typography, oneLineEllipsis } from './Typography';

const COLUMNS = 6;

const Header = styled(H1)`
	position: relative;
	padding: ${Typography.row}px ${Typography.column}px;
	margin: ${Typography.row}px 0;
	z-index: 1;
	${Border}
	border-color: ${Colors.fg.primary};
	border-style: solid;
	background-color: ${Colors.bg.opaque};
	${oneLineEllipsis}
`;

const StyledScreen = styled(Screen)`
	.grid {
		position: relative;
		white-space: nowrap;
		${MouseArrows('vertical')}

		.mouse-arrow {
			&.next,
			&.previous {
				width: 100%;
				height: ${3 * Typography.row}px;
			}
			&.previous {
				top: ${-1 * Typography.row}px;
			}
			&.next {
				top: ${25 * Typography.row}px;
				height: ${6 * Typography.row}px;
			}
		}

		&:hover .mouse-arrow {
			opacity: 0.5;

			&:hover {
				opacity: 1;
			}
		}
	}

	.grid-inner-wrap {
		${Transition('transform')}
	}
`;

const validateFilter = (value: unknown): ListDataConfiguration => {
	try {
		return JSON.parse(atob(value as string));
	} catch (e: unknown) {
		throw new Error(
			`Invalid filter value: "${value}" caused error: "${e}".`,
		);
	}
};

export const DiscoverInner = ({ filter }: ListDataConfiguration) => {
	const { data, loading, error } = usePagedData(filter);

	const gridConfiguration = useMemo(
		() => ({
			performance: Performance,
			dataLength: data[0]?.length,
			visibleGroups: 7,
			elementsPerGroup: COLUMNS,
			config: {
				navigatableGroups: 5,
				scrolling: {
					first: Tile.height / 1.3,
					other: Tile.height,
				},
			},
		}),
		[data[0]],
	);

	const renderGroup = useCallback(
		({ id, elements, offset }: RenderDataGroup) => (
			<div key={id} style={{ transform: `translateY(${offset}px)` }}>
				{elements.map(({ id, dataIndex, onFocus }) => (
					<Tile
						id={id}
						key={id}
						asset={data[0][dataIndex]}
						onFocus={onFocus}
					/>
				))}
			</div>
		),
		[data[0]],
	);

	return (
		<StyledScreen backNavigation={-1}>
			<Header>{filter.title}</Header>
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
			{!loading && !error && (!data || data.pages === 0) && (
				<ScreenCentered>
					<H1>No data available.</H1>
				</ScreenCentered>
			)}
			{data && data[0] && (
				<Grid
					Implementation={BasicGrid}
					configuration={gridConfiguration}
					renderGroup={renderGroup}
					scrollToTopWithBack
					focusOnMount
				/>
			)}
		</StyledScreen>
	);
};

export const Discover = () => {
	const { filter: key } = useParams();
	const { filter } = useAssertedParams({ filter: validateFilter });

	return <DiscoverInner key={key} filter={filter} />;
};
