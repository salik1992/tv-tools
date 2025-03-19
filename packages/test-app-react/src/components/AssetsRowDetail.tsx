import styled from 'styled-components';
import type { Asset } from '@salik1992/test-app-data/types';
import { Colors, Transition } from './Theme';
import {
	H4,
	P,
	Typography,
	nLineEllipsis,
	oneLineEllipsis,
} from './Typography';

const Wrap = styled.div.attrs<{ $visible: boolean }>(({ $visible }) => ({
	style: { height: $visible ? `${6 * Typography.row}px` : '0px' },
}))`
	overflow: hidden;
	${Transition('height')}
	margin-top: ${Typography.row}px;
`;

const Title = styled(H4)`
	margin-bottom: ${Typography.row}px;
	${oneLineEllipsis}
`;

const Description = styled(P)`
	color: ${Colors.fg.secondary};
	max-width: 1000px;
	height: ${3 * Typography.row}px;
	${nLineEllipsis(3)}
`;

export const AssetsRowDetail = ({
	visible,
	asset,
}: {
	visible: boolean;
	asset: Asset;
}) => (
	<Wrap $visible={visible}>
		<Title>{asset.title}</Title>
		<Description>
			{asset.description || 'No description provided.'}
		</Description>
	</Wrap>
);
